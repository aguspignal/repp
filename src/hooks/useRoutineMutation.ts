import routinesService, {
	PostRoutineDayParams,
	PostRoutineExercisesParamas,
	PostRoutineParams
} from "../services/routinesService"
import { useMutation } from "@tanstack/react-query"
import {
	handleOnMutationError,
	isPostgrestError
} from "../utils/queriesHelpers"

export default function useRoutineMutation() {
	const createRoutineMutation = useMutation({
		mutationFn: async (params: PostRoutineParams) => {
			return await routinesService.postRoutine(params)
		},
		onError: handleOnMutationError
	})

	const createRoutineDayMutation = useMutation({
		mutationFn: async (params: PostRoutineDayParams) => {
			return await routinesService.postRoutineDay(params)
		},
		onError: handleOnMutationError
	})

	const createRoutineDayExercisesMutation = useMutation({
		mutationFn: async (params: PostRoutineExercisesParamas) => {
			return await routinesService.postRoutineDayExercisesBulk(params)
		},
		onError: handleOnMutationError
	})

	const deleteRoutineDayMutation = useMutation({
		mutationFn: async (dayId: number) => {
			const result = await routinesService.deleteAllRoutineDayExercises(
				dayId
			)

			if (isPostgrestError(result)) return 0
			return await routinesService.deleteRoutineDay(dayId)
		},
		onError: handleOnMutationError
	})

	return {
		createRoutineMutation,
		createRoutineDayMutation,
		createRoutineDayExercisesMutation,
		deleteRoutineDayMutation
	}
}
