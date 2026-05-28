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

export type CreateExerciseWithProgressionsPayload = {
	exercise: Omit<ExerciseInsert, "user_id">
	progressions: { name: string; order: number }[]
}

export const useCreateExerciseWithProgressions = () => {
	const qc = useQueryClient()
	const userId = useAuthStore(s => s.profile?.id)

	return useMutation({
		mutationFn: async ({ exercise, progressions }: CreateExerciseWithProgressionsPayload) => {
			if (!userId) throw new Error("No user")
			const { data: created, error: exErr } = await supabase
				.from("exercises")
				.insert({ ...exercise, user_id: userId })
				.select()
				.single()
			if (exErr) throw exErr

			if (progressions.length > 0) {
				const { error: progErr } = await supabase.from("progressions").insert(
					progressions.map(p => ({
						exercise_id: created.id,
						name: p.name,
						order: p.order,
					})),
				)
				if (progErr) throw progErr
			}

			return created
		},
		onSuccess: created => {
			if (userId) qc.invalidateQueries({ queryKey: queryKeys.exercises.all(userId) })
			qc.invalidateQueries({ queryKey: queryKeys.progressions.byExercise(created.id) })
		},
	})
}

export type UpdateExerciseWithProgressionsPayload = {
	id: number
	patch: ExerciseUpdate
	progressions: { existingId: number | null; name: string; order: number }[]
}

export const useUpdateExerciseWithProgressions = () => {
	const qc = useQueryClient()
	const userId = useAuthStore(s => s.profile?.id)

	return useMutation({
		mutationFn: async ({ id, patch, progressions }: UpdateExerciseWithProgressionsPayload) => {
			const { data: updated, error: exErr } = await supabase
				.from("exercises")
				.update(patch)
				.eq("id", id)
				.select()
				.single()
			if (exErr) throw exErr

			const { data: existing, error: fetchErr } = await supabase
				.from("progressions")
				.select("id")
				.eq("exercise_id", id)
				.is("deleted_at", null)
			if (fetchErr) throw fetchErr

			const draftIds = new Set(
				progressions.filter(p => p.existingId != null).map(p => p.existingId as number),
			)
			const toSoftDelete = (existing ?? [])
				.filter(row => !draftIds.has(row.id))
				.map(row => row.id)
			const toUpdate = progressions.filter(p => p.existingId != null)
			const toInsert = progressions.filter(p => p.existingId == null)

			if (toSoftDelete.length > 0) {
				const { error: delErr } = await supabase
					.from("progressions")
					.update({ deleted_at: new Date().toISOString() })
					.in("id", toSoftDelete)
				if (delErr) throw delErr
			}

			for (const p of toUpdate) {
				const { error: updErr } = await supabase
					.from("progressions")
					.update({ name: p.name, order: p.order })
					.eq("id", p.existingId!)
				if (updErr) throw updErr
			}

			if (toInsert.length > 0) {
				const { error: insErr } = await supabase.from("progressions").insert(
					toInsert.map(p => ({
						exercise_id: id,
						name: p.name,
						order: p.order,
					})),
				)
				if (insErr) throw insErr
			}

			return updated
		},
		onSuccess: updated => {
			qc.invalidateQueries({ queryKey: queryKeys.exercises.byId(updated.id) })
			qc.invalidateQueries({ queryKey: queryKeys.progressions.byExercise(updated.id) })
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
