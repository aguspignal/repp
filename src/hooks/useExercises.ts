import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/authStore"
import type { Exercise, ExerciseInsert, ExerciseUpdate } from "../types/db"
import { queryKeys } from "./queryKeys"

// Walks the active list bottom-to-top, assigning the smallest integer
// strictly greater than the prior item's order that is not already held
// by a soft-deleted sibling. Items already at the right value stay put;
// values "collide-free" against history forever.
const computeProgressionOrders = (
	activeCountTopToBottom: number,
	reservedOrders: ReadonlySet<number>,
): number[] => {
	const orders = new Array<number>(activeCountTopToBottom)
	let prev = 0
	for (let i = activeCountTopToBottom - 1; i >= 0; i--) {
		let candidate = prev + 1
		while (reservedOrders.has(candidate)) candidate++
		orders[i] = candidate
		prev = candidate
	}
	return orders
}

const partitionProgressionsByUsage = async (
	progressionIds: number[],
): Promise<{ hardDelete: number[]; softDelete: number[] }> => {
	if (progressionIds.length === 0) return { hardDelete: [], softDelete: [] }
	const { data: usedRows, error } = await supabase
		.from("workout_sets")
		.select("progression_id")
		.in("progression_id", progressionIds)
	if (error) throw error
	const used = new Set((usedRows ?? []).map(r => r.progression_id))
	return {
		hardDelete: progressionIds.filter(pid => !used.has(pid)),
		softDelete: progressionIds.filter(pid => used.has(pid)),
	}
}

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
	progressions: { name: string }[]
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
				const orders = computeProgressionOrders(progressions.length, new Set())
				const { error: progErr } = await supabase.from("progressions").insert(
					progressions.map((p, idx) => ({
						exercise_id: created.id,
						name: p.name,
						order: orders[idx],
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
	progressions: { existingId: number | null; name: string }[]
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

			const { data: existingAll, error: fetchErr } = await supabase
				.from("progressions")
				.select("id, order, deleted_at")
				.eq("exercise_id", id)
			if (fetchErr) throw fetchErr

			const existingActive = (existingAll ?? []).filter(r => r.deleted_at == null)
			const draftIds = new Set(
				progressions.filter(p => p.existingId != null).map(p => p.existingId as number),
			)
			const toRemove = existingActive.filter(r => !draftIds.has(r.id)).map(r => r.id)

			const reservedOrders = new Set<number>(
				(existingAll ?? []).filter(r => r.deleted_at != null).map(r => r.order),
			)

			if (toRemove.length > 0) {
				const { hardDelete, softDelete } = await partitionProgressionsByUsage(toRemove)
				if (hardDelete.length > 0) {
					const { error: hardErr } = await supabase
						.from("progressions")
						.delete()
						.in("id", hardDelete)
					if (hardErr) throw hardErr
				}
				if (softDelete.length > 0) {
					const { error: softErr } = await supabase
						.from("progressions")
						.update({ deleted_at: new Date().toISOString() })
						.in("id", softDelete)
					if (softErr) throw softErr
					// Newly soft-deleted orders also become reserved going forward.
					for (const removedId of softDelete) {
						const row = existingActive.find(r => r.id === removedId)
						if (row) reservedOrders.add(row.order)
					}
				}
			}

			const newOrders = computeProgressionOrders(progressions.length, reservedOrders)
			const existingOrderById = new Map<number, number>(
				existingActive.map(r => [r.id, r.order]),
			)

			for (let i = 0; i < progressions.length; i++) {
				const p = progressions[i]
				const targetOrder = newOrders[i]
				if (p.existingId != null) {
					const currentOrder = existingOrderById.get(p.existingId)
					const orderChanged = currentOrder !== targetOrder
					const { error: updErr } = await supabase
						.from("progressions")
						.update(
							orderChanged ? { name: p.name, order: targetOrder } : { name: p.name },
						)
						.eq("id", p.existingId)
					if (updErr) throw updErr
				}
			}

			const toInsert = progressions
				.map((p, idx) => ({ p, idx }))
				.filter(({ p }) => p.existingId == null)

			if (toInsert.length > 0) {
				const { error: insErr } = await supabase.from("progressions").insert(
					toInsert.map(({ p, idx }) => ({
						exercise_id: id,
						name: p.name,
						order: newOrders[idx],
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
			const { data: progRows, error: progErr } = await supabase
				.from("progressions")
				.select("id")
				.eq("exercise_id", id)
			if (progErr) throw progErr
			const progressionIds = (progRows ?? []).map(p => p.id)

			const { count: workoutExerciseCount, error: weErr } = await supabase
				.from("workout_exercises")
				.select("id", { count: "exact", head: true })
				.eq("exercise_id", id)
			if (weErr) throw weErr

			const exerciseUsed = (workoutExerciseCount ?? 0) > 0

			if (!exerciseUsed) {
				if (progressionIds.length > 0) {
					const { error: delProgErr } = await supabase
						.from("progressions")
						.delete()
						.in("id", progressionIds)
					if (delProgErr) throw delProgErr
				}
				const { error: delExErr } = await supabase.from("exercises").delete().eq("id", id)
				if (delExErr) throw delExErr
				return id
			}

			const now = new Date().toISOString()
			const { error: softExErr } = await supabase
				.from("exercises")
				.update({ deleted_at: now })
				.eq("id", id)
			if (softExErr) throw softExErr

			if (progressionIds.length > 0) {
				const { hardDelete, softDelete } =
					await partitionProgressionsByUsage(progressionIds)
				if (hardDelete.length > 0) {
					const { error: hardErr } = await supabase
						.from("progressions")
						.delete()
						.in("id", hardDelete)
					if (hardErr) throw hardErr
				}
				if (softDelete.length > 0) {
					const { error: softErr } = await supabase
						.from("progressions")
						.update({ deleted_at: now })
						.in("id", softDelete)
					if (softErr) throw softErr
				}
			}
			return id
		},
		onSuccess: id => {
			if (userId) {
				qc.invalidateQueries({ queryKey: queryKeys.exercises.all(userId) })
				qc.invalidateQueries({ queryKey: queryKeys.exercises.deleted(userId) })
			}
			qc.invalidateQueries({ queryKey: queryKeys.exercises.byId(id) })
			qc.invalidateQueries({ queryKey: queryKeys.progressions.byExercise(id) })
		},
	})
}

export const useDeletedExercises = () => {
	const userId = useAuthStore(s => s.profile?.id)
	return useQuery({
		queryKey: userId ? queryKeys.exercises.deleted(userId) : ["exercises", "noUser", "deleted"],
		queryFn: async (): Promise<Exercise[]> => {
			if (!userId) return []
			const { data, error } = await supabase
				.from("exercises")
				.select("*")
				.eq("user_id", userId)
				.not("deleted_at", "is", null)
				.order("deleted_at", { ascending: false })
			if (error) throw error
			return data ?? []
		},
		enabled: !!userId,
	})
}

export const useRestoreExercise = () => {
	const qc = useQueryClient()
	const userId = useAuthStore(s => s.profile?.id)

	return useMutation({
		mutationFn: async (id: number) => {
			const { error: exErr } = await supabase
				.from("exercises")
				.update({ deleted_at: null })
				.eq("id", id)
			if (exErr) throw exErr

			const { error: progErr } = await supabase
				.from("progressions")
				.update({ deleted_at: null })
				.eq("exercise_id", id)
				.not("deleted_at", "is", null)
			if (progErr) throw progErr

			return id
		},
		onSuccess: id => {
			if (userId) {
				qc.invalidateQueries({ queryKey: queryKeys.exercises.all(userId) })
				qc.invalidateQueries({ queryKey: queryKeys.exercises.deleted(userId) })
			}
			qc.invalidateQueries({ queryKey: queryKeys.exercises.byId(id) })
			qc.invalidateQueries({ queryKey: queryKeys.progressions.byExercise(id) })
		},
	})
}
