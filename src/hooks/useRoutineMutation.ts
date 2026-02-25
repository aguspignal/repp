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
	DraftRoutineDayExercise
} from "../types/routines"
import { PostgrestError } from "@supabase/supabase-js"
import { useMutation } from "@tanstack/react-query"

export default function useRoutineMutation() {
	const createRoutineMutation = useMutation({
		mutationFn: createRoutine,
		onError: handleOnMutationError
	})

	const createRoutineDayMutation = useMutation({
		mutationFn: createRoutineDay,
		onError: handleOnMutationError
	})

	const createRoutineDayExercisesMutation = useMutation({
		mutationFn: createRoutineDayExercises,
		onError: handleOnMutationError
	})

	const markRoutineAsActiveMutation = useMutation({
		mutationFn: markRoutineAsActive,
		onError: handleOnMutationError
	})

	const markRoutineAsDraftMutation = useMutation({
		mutationFn: markRoutineAsDraft,
		onError: handleOnMutationError
	})

	const updateRoutineMutation = useMutation({
		mutationFn: updateRoutine,
		onError: handleOnMutationError
	})

	const updateRoutineDayAndExercisesMutation = useMutation({
		mutationFn: updateRoutineDayAndExercises,
		onError: handleOnMutationError
	})

	const deleteRoutineDayMutation = useMutation({
		mutationFn: deleteRoutineDay,
		onError: handleOnMutationError
	})

	const deleteAllRoutineDataMutation = useMutation({
		mutationFn: deleteAllRoutineData,
		onError: handleOnMutationError
	})

	return {
		createRoutineMutation,
		createRoutineDayMutation,
		createRoutineDayExercisesMutation,
		deleteRoutineDayMutation,
		updateRoutineMutation,
		updateRoutineDayAndExercisesMutation,
		markRoutineAsActiveMutation,
		markRoutineAsDraftMutation,
		deleteAllRoutineDataMutation
	}
}

async function createRoutine(
	params: PostRoutineParams
): Promise<DatabaseRoutine | null | PostgrestError> {
	return await routinesService.postRoutine(params)
}

async function createRoutineDay(
	params: PostRoutineDayParams
): Promise<DatabaseRoutineDay | null | PostgrestError> {
	return await routinesService.postRoutineDay(params)
}

async function createRoutineDayExercises(
	params: PostRoutineExercisesParamas
): Promise<DatabaseRoutineDayExercise[] | PostgrestError> {
	return await routinesService.postRoutineDayExercisesBulk(params)
}

async function updateRoutine(
	routine: DatabaseRoutine
): Promise<DatabaseRoutine | null | PostgrestError> {
	return await routinesService.updateRoutine(routine)
}

async function markRoutineAsActive({
	userId,
	routineId
}: UpdateUserRoutineStatusParams): Promise<number | PostgrestError> {
	const result = await routinesService.updateUserActiveRoutinesAsDraft(userId)
	if (isPostgrestError(result)) return result

	return await routinesService.updateRoutineAsActive(routineId)
}

async function markRoutineAsDraft(
	rId: number
): Promise<number | PostgrestError> {
	return await routinesService.updateUserActiveRoutinesAsDraft(rId)
}

async function updateRoutineDayAndExercises({
	day,
	deleteRoutineDayExercisesIds,
	upsertRoutineDayExercises,
	insertRoutineDayExercises
}: UpdateRoutineDayAndExercisesParams): Promise<
	DatabaseRoutineDay | null | PostgrestError
> {
	const newRoutineDay = await routinesService.updateRoutineDay(day)

	if (!newRoutineDay || isPostgrestError(newRoutineDay)) return newRoutineDay

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
}

async function deleteRoutineDay(
	dayId: number
): Promise<number | PostgrestError> {
	const result = await routinesService.deleteAllRoutineDayExercises(dayId)

	if (isPostgrestError(result)) return 0
	return await routinesService.deleteRoutineDay(dayId)
}

async function deleteAllRoutineData(
	rId: number
): Promise<number | PostgrestError> {
	return await routinesService.deleteAllRoutineData(rId)
}

type UpdateRoutineDayAndExercisesParams = {
	day: DatabaseRoutineDay
	deleteRoutineDayExercisesIds: number[]
	upsertRoutineDayExercises: DatabaseRoutineDayExercise[]
	insertRoutineDayExercises: DraftRoutineDayExercise[]
}
