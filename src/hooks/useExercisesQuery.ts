import { ExerciseHistorySet } from "../types/workouts"
import { ExerciseWithProgressions } from "../types/exercises"
import { isPostgrestError } from "../utils/queriesHelpers"
import { PostgrestError } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import exercisesService from "../services/exercisesService"

const RQKEY_ROOT = "exercisesQueries"
export const GETUSEREXERCISESANDPROGRESSIONS_KEY = (uId: number) => [
	RQKEY_ROOT,
	"userExercisesAndProgressions",
	uId
]
export const GETEXERCISEANDPROGRESSIONSBYID_KEY = (id: number) => [
	RQKEY_ROOT,
	"exerciseAndProgressions",
	id
]
export const GETEXERCISEHISTORY_KEY = (eId: number, df: string, dt: string) => [
	RQKEY_ROOT,
	"exerciseHistory",
	eId,
	df,
	dt
]

export default function useExercisesQuery() {
	function getUserExercisesAndProgressions(userId: number | undefined) {
		return useQuery<ExerciseWithProgressions[] | PostgrestError>({
			queryKey: GETUSEREXERCISESANDPROGRESSIONS_KEY(userId ?? 0),
			queryFn: async () => {
				if (!userId) return []

				const exercises =
					await exercisesService.fetchExercisesByUserId(userId)

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
			}
		})
	}

	function getExerciseAndProgressionsById(id: number | undefined) {
		return useQuery<ExerciseWithProgressions | null | PostgrestError>({
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

	function getExerciseHistory({
		exerciseId,
		highestProgressionOrder,
		lowestProgressionOrder,
		...rest
	}: GetExerciseHistoryParams) {
		return useQuery<ExerciseHistorySet[] | null | PostgrestError>({
			queryKey: GETEXERCISEHISTORY_KEY(
				exerciseId ?? 0,
				rest.fromDate.toISOString(),
				rest.toDate.toISOString()
			),
			queryFn: async () => {
				if (
					!exerciseId ||
					!highestProgressionOrder ||
					!lowestProgressionOrder
				)
					return null

				return exercisesService.fetchExerciseHistory({
					exerciseId,
					highestProgressionOrder,
					lowestProgressionOrder,
					...rest
				})
			}
			// enabled:
			// 	!!exerciseId &&
			// 	!!highestProgressionOrder &&
			// 	!!lowestProgressionOrder
		})
	}

	return {
		getUserExercisesAndProgressions,
		getExerciseAndProgressionsById,
		getExerciseHistory
	}
}

type GetExerciseHistoryParams = {
	exerciseId: number | undefined
	highestProgressionOrder: number | undefined
	lowestProgressionOrder: number | undefined
	fromDate: Date
	toDate: Date
}
