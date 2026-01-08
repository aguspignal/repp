import routinesService, {
	PostRoutineDayParams,
	PostRoutineExercisesParamas,
	PostRoutineParams,
	UpdateRoutineDayParams
} from "../services/routinesService"
import { useMutation } from "@tanstack/react-query"
import {
	handleOnMutationError,
	isPostgrestError
} from "../utils/queriesHelpers"
import {
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise,
	DraftRoutineDayExercise
} from "../types/routines"
import { DatabaseExercise } from "../types/exercises"

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

	const updateRoutineDayAndExercisesMutation = useMutation({
		mutationFn: async ({
			day,
			deleteRoutineDayExercisesIds,
			upsertRoutineDayExercises,
			insertRoutineDayExercises
		}: UpdateRoutineDayAndExercisesParams) => {
			const newRoutineDay = await routinesService.updateRoutineDay(day)

			if (!newRoutineDay || isPostgrestError(newRoutineDay))
				return newRoutineDay

			if (deleteRoutineDayExercisesIds.length > 0)
				await routinesService.deleteRoutineDayExercisesByIds(
					deleteRoutineDayExercisesIds
				)

			if (upsertRoutineDayExercises.length > 0)
				await routinesService.upsertRoutineDayExercises(
					upsertRoutineDayExercises
				)

			if (insertRoutineDayExercises.length > 0)
				await routinesService.postRoutineDayExercisesBulk({
					routineDayId: newRoutineDay.id,
					exercises: insertRoutineDayExercises
				})

			return newRoutineDay
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
		deleteRoutineDayMutation,
		updateRoutineDayAndExercisesMutation
	}
}

type UpdateRoutineDayAndExercisesParams = {
	day: DatabaseRoutineDay
	deleteRoutineDayExercisesIds: number[]
	upsertRoutineDayExercises: DatabaseRoutineDayExercise[]
	insertRoutineDayExercises: DraftRoutineDayExercise[]
}
