import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/authStore"
import type { BodyweightLog, BodyweightLogInsert } from "../types/db"
import { queryKeys } from "./queryKeys"

export const useBodyweightLogs = () => {
	const userId = useAuthStore(s => s.profile?.id)
	return useQuery({
		queryKey: userId ? queryKeys.bodyweight.all(userId) : ["bodyweight", "noUser"],
		queryFn: async (): Promise<BodyweightLog[]> => {
			const { data, error } = await supabase
				.from("bodyweight_logs")
				.select("*")
				.eq("user_id", userId!)
				.order("logged_at", { ascending: false })
			if (error) throw error
			return data ?? []
		},
		enabled: !!userId,
	})
}

export const useLogBodyweight = () => {
	const qc = useQueryClient()
	const userId = useAuthStore(s => s.profile?.id)

	return useMutation({
		mutationFn: async (payload: Omit<BodyweightLogInsert, "user_id">) => {
			if (!userId) throw new Error("No user")
			const { data, error } = await supabase
				.from("bodyweight_logs")
				.insert({ ...payload, user_id: userId })
				.select()
				.single()
			if (error) throw error
			return data
		},
		onSuccess: () => {
			if (userId) qc.invalidateQueries({ queryKey: queryKeys.bodyweight.all(userId) })
		},
	})
}
