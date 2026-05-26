import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/authStore"
import type { Routine, RoutineDay, RoutineInsert, RoutineUpdate } from "../types/db"
import { queryKeys } from "./queryKeys"

export const useRoutines = () => {
	const userId = useAuthStore(s => s.profile?.id)
	return useQuery({
		queryKey: userId ? queryKeys.routines.all(userId) : ["routines", "noUser"],
		queryFn: async (): Promise<Routine[]> => {
			const { data, error } = await supabase
				.from("routines")
				.select("*")
				.eq("user_id", userId!)
				.is("deleted_at", null)
				.order("created_at", { ascending: false })
			if (error) throw error
			return data ?? []
		},
		enabled: !!userId,
	})
}

export const useRoutine = (id: number | null) =>
	useQuery({
		queryKey: queryKeys.routines.byId(id ?? -1),
		queryFn: async (): Promise<Routine | null> => {
			if (!id) return null
			const { data, error } = await supabase.from("routines").select("*").eq("id", id).maybeSingle()
			if (error) throw error
			return data
		},
		enabled: id != null,
	})

export const useRoutineDays = (routineId: number | null) =>
	useQuery({
		queryKey: queryKeys.routines.days(routineId ?? -1),
		queryFn: async (): Promise<RoutineDay[]> => {
			if (!routineId) return []
			const { data, error } = await supabase
				.from("routine_days")
				.select("*")
				.eq("routine_id", routineId)
				.is("deleted_at", null)
			if (error) throw error
			return data ?? []
		},
		enabled: routineId != null,
	})

export const useCreateRoutine = () => {
	const qc = useQueryClient()
	const userId = useAuthStore(s => s.profile?.id)

	return useMutation({
		mutationFn: async (payload: Omit<RoutineInsert, "user_id">) => {
			if (!userId) throw new Error("No user")
			const { data, error } = await supabase
				.from("routines")
				.insert({ ...payload, user_id: userId })
				.select()
				.single()
			if (error) throw error
			return data
		},
		onSuccess: () => {
			if (userId) qc.invalidateQueries({ queryKey: queryKeys.routines.all(userId) })
		},
	})
}

export const useUpdateRoutine = () => {
	const qc = useQueryClient()
	const userId = useAuthStore(s => s.profile?.id)

	return useMutation({
		mutationFn: async ({ id, patch }: { id: number; patch: RoutineUpdate }) => {
			const { data, error } = await supabase
				.from("routines")
				.update(patch)
				.eq("id", id)
				.select()
				.single()
			if (error) throw error
			return data
		},
		onSuccess: (_data, vars) => {
			qc.invalidateQueries({ queryKey: queryKeys.routines.byId(vars.id) })
			if (userId) qc.invalidateQueries({ queryKey: queryKeys.routines.all(userId) })
		},
	})
}
