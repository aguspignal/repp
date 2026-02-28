import routinesService, {
	PostRoutineDayParams,
	PostRoutineExercisesParamas,
	PostRoutineParams,
	PostRoutineScheduleParams,
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
	DatabaseSchedule,
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

	const replaceRoutineScheduleMutation = useMutation({
		mutationFn: replaceRoutineSchedule,
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
		createRoutineDayExercisesMutation,
		createRoutineDayMutation,
		createRoutineMutation,
		replaceRoutineScheduleMutation,
		deleteAllRoutineDataMutation,
		deleteRoutineDayMutation,
		markRoutineAsActiveMutation,
		markRoutineAsDraftMutation,
		updateRoutineDayAndExercisesMutation,
		updateRoutineMutation
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

async function replaceRoutineSchedule(
	params: PostRoutineScheduleParams
): Promise<DatabaseSchedule[] | PostgrestError> {
	return await routinesService.deleteAndPostRoutineSchedule(params)
}

async function deleteRoutineDay(
	dayId: number
): Promise<number | PostgrestError> {
	const exercisesResult =
		await routinesService.deleteAllRoutineDayExercises(dayId)
	const schedulesResult =
		await routinesService.deleteRoutineDaySchedules(dayId)
	const workoutsResult = await routinesService.deleteRoutineDayWorkouts(dayId)

	if (isPostgrestError(exercisesResult)) return exercisesResult
	if (isPostgrestError(schedulesResult)) return schedulesResult
	if (isPostgrestError(workoutsResult)) return workoutsResult
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
