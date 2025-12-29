import { DatabaseExercise, ExerciseAndProgressions } from "../types/exercises"
import { isPostgrestError } from "../utils/queriesHelpers"
import { PostgrestError } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import exercisesService from "../services/exercisesService"

const RQKEY_ROOT = "exercises"
export const GETEXERCISEANDPROGRESSIONSBYID_KEY = (id: number) => [
	RQKEY_ROOT,
	id
]
export const GETUSEREXERCISESLAZY_KEY = (uId: number) => [
	RQKEY_ROOT,
	"user",
	uId
]

export default function useExercisesQuery() {
	function getExerciseAndProgressionsById(id: number | undefined) {
		return useQuery<ExerciseAndProgressions | null | PostgrestError>({
			queryKey: GETEXERCISEANDPROGRESSIONSBYID_KEY(id ?? 0),
			queryFn: async () => {
				if (!id) return null
				const exercise = await exercisesService.getExerciseById(id)

				if (!exercise || isPostgrestError(exercise)) return exercise

				const progressions =
					await exercisesService.getProgressionsByExerciseId(id)

				if (isPostgrestError(progressions)) return progressions

				return { exercise, progressions }
			}
		})
	}

	function getUserExercisesLazy(userId: number | undefined) {
		return useQuery<DatabaseExercise[] | PostgrestError>({
			queryKey: GETUSEREXERCISESLAZY_KEY(userId ?? 0),
			queryFn: async () => {
				if (!userId) return []
				return await exercisesService.getExercisesByUserId(userId)
			},
			enabled: false
		})
	}

	return {
		getExerciseAndProgressionsById,
		getUserExercisesLazy
	}
}
