import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/authStore"
import type { Exercise, ExerciseInsert, ExerciseUpdate } from "../types/db"
import { queryKeys } from "./queryKeys"

const fetchExercises = async (userId: number): Promise<Exercise[]> => {
	const { data, error } = await supabase
		.from("exercises")
		.select("*")
		.eq("user_id", userId)
		.is("deleted_at", null)
		.order("name", { ascending: true })
	if (error) throw error
	return data ?? []
}

export const useExercises = () => {
	const userId = useAuthStore(s => s.profile?.id)
	return useQuery({
		queryKey: userId ? queryKeys.exercises.all(userId) : ["exercises", "noUser"],
		queryFn: () => fetchExercises(userId!),
		enabled: !!userId,
	})
}

export const useExercise = (id: number | null) =>
	useQuery({
		queryKey: queryKeys.exercises.byId(id ?? -1),
		queryFn: async (): Promise<Exercise | null> => {
			if (!id) return null
			const { data, error } = await supabase
				.from("exercises")
				.select("*")
				.eq("id", id)
				.maybeSingle()
			if (error) throw error
			return data
		},
		enabled: id != null,
	})

export const useCreateExercise = () => {
	const qc = useQueryClient()
	const userId = useAuthStore(s => s.profile?.id)

	return useMutation({
		mutationFn: async (payload: Omit<ExerciseInsert, "user_id">) => {
			if (!userId) throw new Error("No user")
			const { data, error } = await supabase
				.from("exercises")
				.insert({ ...payload, user_id: userId })
				.select()
				.single()
			if (error) throw error
			return data
		},
		onSuccess: () => {
			if (userId) qc.invalidateQueries({ queryKey: queryKeys.exercises.all(userId) })
		},
	})
}

export const useUpdateExercise = () => {
	const qc = useQueryClient()
	const userId = useAuthStore(s => s.profile?.id)

	return useMutation({
		mutationFn: async ({ id, patch }: { id: number; patch: ExerciseUpdate }) => {
			const { data, error } = await supabase
				.from("exercises")
				.update(patch)
				.eq("id", id)
				.select()
				.single()
			if (error) throw error
			return data
		},
		onSuccess: (_data, vars) => {
			qc.invalidateQueries({ queryKey: queryKeys.exercises.byId(vars.id) })
			if (userId) qc.invalidateQueries({ queryKey: queryKeys.exercises.all(userId) })
		},
	})
}

export const useDeleteExercise = () => {
	const qc = useQueryClient()
	const userId = useAuthStore(s => s.profile?.id)

	return useMutation({
		mutationFn: async (id: number) => {
			const { error } = await supabase
				.from("exercises")
				.update({ deleted_at: new Date().toISOString() })
				.eq("id", id)
			if (error) throw error
			return id
		},
		onSuccess: () => {
			if (userId) qc.invalidateQueries({ queryKey: queryKeys.exercises.all(userId) })
		},
	})
}
