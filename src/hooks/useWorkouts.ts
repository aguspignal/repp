import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/authStore"
import type {
	Workout,
	WorkoutExercise,
	WorkoutInsert,
	WorkoutSet,
	WorkoutSetInsert,
} from "../types/db"
import { queryKeys } from "./queryKeys"

export const useWorkouts = () => {
	const userId = useAuthStore(s => s.profile?.id)
	return useQuery({
		queryKey: userId ? queryKeys.workouts.all(userId) : ["workouts", "noUser"],
		queryFn: async (): Promise<Workout[]> => {
			const { data, error } = await supabase
				.from("workouts")
				.select("*")
				.eq("user_id", userId!)
				.order("date", { ascending: false })
			if (error) throw error
			return data ?? []
		},
		enabled: !!userId,
	})
}

export const useRecentWorkouts = (limit = 10) => {
	const userId = useAuthStore(s => s.profile?.id)
	return useQuery({
		queryKey: userId
			? queryKeys.workouts.recent(userId, limit)
			: ["workouts", "noUser", "recent"],
		queryFn: async (): Promise<Workout[]> => {
			const { data, error } = await supabase
				.from("workouts")
				.select("*")
				.eq("user_id", userId!)
				.order("date", { ascending: false })
				.limit(limit)
			if (error) throw error
			return data ?? []
		},
		enabled: !!userId,
	})
}

export type WorkoutDetail = Workout & {
	workout_exercises: (WorkoutExercise & { workout_sets: WorkoutSet[] })[]
}

export const useWorkoutDetail = (id: number | null) =>
	useQuery({
		queryKey: queryKeys.workouts.byId(id ?? -1),
		queryFn: async (): Promise<WorkoutDetail | null> => {
			if (!id) return null
			const { data, error } = await supabase
				.from("workouts")
				.select("*, workout_exercises(*, workout_sets(*))")
				.eq("id", id)
				.maybeSingle()
			if (error) throw error
			return data as WorkoutDetail | null
		},
		enabled: id != null,
	})

export type CreateWorkoutPayload = Omit<WorkoutInsert, "user_id"> & {
	exercises?: {
		exercise_id: number
		routineday_exercise_id: number
		order: number
		is_unplanned?: boolean
		sets: Omit<WorkoutSetInsert, "workout_exercise_id">[]
	}[]
}

export const useCreateWorkout = () => {
	const qc = useQueryClient()
	const userId = useAuthStore(s => s.profile?.id)

	return useMutation({
		mutationFn: async (payload: CreateWorkoutPayload) => {
			if (!userId) throw new Error("No user")
			const { exercises, ...workoutFields } = payload

			const { data: workout, error: workoutErr } = await supabase
				.from("workouts")
				.insert({ ...workoutFields, user_id: userId })
				.select()
				.single()
			if (workoutErr) throw workoutErr

			if (exercises?.length) {
				for (const ex of exercises) {
					const { data: we, error: weErr } = await supabase
						.from("workout_exercises")
						.insert({
							workout_id: workout.id,
							exercise_id: ex.exercise_id,
							routineday_exercise_id: ex.routineday_exercise_id,
							order: ex.order,
							is_unplanned: ex.is_unplanned ?? false,
						})
						.select()
						.single()
					if (weErr) throw weErr

					if (ex.sets.length) {
						const { error: setsErr } = await supabase.from("workout_sets").insert(
							ex.sets.map(s => ({
								...s,
								workout_exercise_id: we.id,
							})),
						)
						if (setsErr) throw setsErr
					}
				}
			}

			return workout
		},
		onSuccess: () => {
			if (!userId) return
			qc.invalidateQueries({ queryKey: queryKeys.workouts.all(userId) })
			qc.invalidateQueries({ queryKey: ["workouts", userId, "recent"] })
		},
	})
}
