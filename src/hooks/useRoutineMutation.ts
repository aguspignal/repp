import routinesService, {
	PostRoutineDayParams,
	PostRoutineExercisesParamas,
	PostRoutineParams,
	UpdateUserRoutineStatusParams
} from "../services/routinesService"
import {
	handleOnMutationError,
	isPostgrestError
} from "../utils/queriesHelpers"
import {
	DatabaseRoutine,
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise,
	DraftRoutineDayExercise,
	DraftWorkoutSet
} from "../types/routines"
import { useMutation } from "@tanstack/react-query"

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

	const createWorkoutAndSetsMutation = useMutation({
		mutationFn: async ({
			date,
			draftSets,
			note,
			routineDayId
		}: PostWorkoutAndSetsParams) => {
			console.log("Mut")
			const workout = await routinesService.postWorkout({
				date,
				note,
				routineDayId
			})

			if (!workout || isPostgrestError(workout)) return workout

			console.log(workout)
			const sets = await routinesService.postWorkoutSetsBulk({
				workoutId: workout.id,
				draftSets
			})

			if (!sets || isPostgrestError(sets)) return sets
			return { workout, sets }
		},
		onError: handleOnMutationError
	})

	const markRoutineAsActiveMutation = useMutation({
		mutationFn: async ({
			userId,
			routineId
		}: UpdateUserRoutineStatusParams) => {
			const result =
				await routinesService.updateUserActiveRoutinesAsDraft(userId)
			if (isPostgrestError(result)) return result

			return await routinesService.updateRoutineAsActive(routineId)
		},
		onError: handleOnMutationError
	})

	const markRoutineAsDraftMutation = useMutation({
		mutationFn: async (routineId: number) => {
			return await routinesService.updateUserActiveRoutinesAsDraft(
				routineId
			)
		},
		onError: handleOnMutationError
	})

	const updateRoutineMutation = useMutation({
		mutationFn: async (routine: DatabaseRoutine) => {
			return await routinesService.updateRoutine(routine)
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
		createWorkoutAndSetsMutation,
		deleteRoutineDayMutation,
		updateRoutineMutation,
		updateRoutineDayAndExercisesMutation,
		markRoutineAsActiveMutation,
		markRoutineAsDraftMutation
	}
}

type UpdateRoutineDayAndExercisesParams = {
	day: DatabaseRoutineDay
	deleteRoutineDayExercisesIds: number[]
	upsertRoutineDayExercises: DatabaseRoutineDayExercise[]
	insertRoutineDayExercises: DraftRoutineDayExercise[]
}

type PostWorkoutAndSetsParams = {
	routineDayId: number
	date: string
	note: string | null
	draftSets: DraftWorkoutSet[]
}
