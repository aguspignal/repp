import { ExerciseAndProgressions } from "../types/exercises"
import { isPostgrestError } from "../utils/queriesHelpers"
import { PostgrestError } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import exercisesService from "../services/exercisesService"

const RQKEY_ROOT = "exercises"
export const GETUSEREXERCISESANDPROGRESSIONSLAZY_KEY = (uId: number) => [
	RQKEY_ROOT,
	"user",
	uId
]
export const GETEXERCISEANDPROGRESSIONSBYID_KEY = (id: number) => [
	RQKEY_ROOT,
	id
]

export default function useExercisesQuery() {
	function getUserExercisesAndProgressionsLazy(userId: number | undefined) {
		return useQuery<ExerciseAndProgressions[] | PostgrestError>({
			queryKey: GETUSEREXERCISESANDPROGRESSIONSLAZY_KEY(userId ?? 0),
			queryFn: async () => {
				if (!userId) return []

				const exercises = await exercisesService.fetchExercisesByUserId(
					userId
				)

				if (isPostgrestError(exercises)) return exercises

				const progressions =
					await exercisesService.fetchProgressionsByExercisesIds(
						exercises.map((e) => e.id)
					)

				if (isPostgrestError(progressions)) return progressions

				return exercises.map((e) => ({
					exercise: e,
					progressions: progressions.filter(
						(p) => p.exercise_id === e.id
					)
				}))
			},
			enabled: false
		})
	}

	function getExerciseAndProgressionsById(id: number | undefined) {
		return useQuery<ExerciseAndProgressions | null | PostgrestError>({
			queryKey: GETEXERCISEANDPROGRESSIONSBYID_KEY(id ?? 0),
			queryFn: async () => {
				if (!id) return null
				const exercise = await exercisesService.fetchExerciseById(id)

				if (!exercise || isPostgrestError(exercise)) return exercise

				const progressions =
					await exercisesService.fetchProgressionsByExercisesIds([id])

				if (isPostgrestError(progressions)) return progressions

				return { exercise, progressions }
			}
		})
	}

	return {
		getUserExercisesAndProgressionsLazy,
		getExerciseAndProgressionsById
	}
}
