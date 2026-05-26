import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/authStore"
import type { Mesocycle, MesocycleInsert } from "../types/db"
import { queryKeys } from "./queryKeys"

export const useMesocycles = () => {
	const userId = useAuthStore(s => s.profile?.id)
	return useQuery({
		queryKey: userId ? queryKeys.mesocycles.all(userId) : ["mesocycles", "noUser"],
		queryFn: async (): Promise<Mesocycle[]> => {
			const { data, error } = await supabase
				.from("mesocycles")
				.select("*")
				.eq("user_id", userId!)
				.is("deleted_at", null)
				.order("start_date", { ascending: false })
			if (error) throw error
			return data ?? []
		},
		enabled: !!userId,
	})
}

export const useActiveMesocycle = () => {
	const userId = useAuthStore(s => s.profile?.id)
	return useQuery({
		queryKey: userId ? queryKeys.mesocycles.active(userId) : ["mesocycles", "noUser", "active"],
		queryFn: async (): Promise<Mesocycle | null> => {
			const { data, error } = await supabase
				.from("mesocycles")
				.select("*")
				.eq("user_id", userId!)
				.eq("status", "active")
				.is("deleted_at", null)
				.order("start_date", { ascending: false })
				.limit(1)
				.maybeSingle()
			if (error) throw error
			return data
		},
		enabled: !!userId,
	})
}

export const useCreateMesocycle = () => {
	const qc = useQueryClient()
	const userId = useAuthStore(s => s.profile?.id)

	return useMutation({
		mutationFn: async (payload: Omit<MesocycleInsert, "user_id">) => {
			if (!userId) throw new Error("No user")
			const { data, error } = await supabase
				.from("mesocycles")
				.insert({ ...payload, user_id: userId })
				.select()
				.single()
			if (error) throw error
			return data
		},
		onSuccess: () => {
			if (!userId) return
			qc.invalidateQueries({ queryKey: queryKeys.mesocycles.all(userId) })
			qc.invalidateQueries({ queryKey: queryKeys.mesocycles.active(userId) })
		},
	})
}
