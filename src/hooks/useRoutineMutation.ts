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
	DatabaseWorkout,
	DatabaseWorkoutSet,
	DraftRoutineDayExercise,
	DraftWorkoutSet,
	WorkoutAndSets
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

	const createWorkoutAndSetsMutation = useMutation({
		mutationFn: createWorkoutAndSets,
		onError: handleOnMutationError
	})

	const updateWorkoutAndSetsMutation = useMutation({
		mutationFn: updateWorkoutAndSets,
		onError: handleOnMutationError
	})

	const updateWorkoutSetsMutation = useMutation({
		mutationFn: updateWorkoutSets,
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

	const deleteWorkoutMutation = useMutation({
		mutationFn: deleteWorkout,
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
		markRoutineAsDraftMutation,
		updateWorkoutAndSetsMutation,
		updateWorkoutSetsMutation,
		deleteWorkoutMutation
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

async function createWorkoutAndSets({
	date,
	draftSets,
	note,
	routineDayId
}: PostWorkoutAndSetsParams): Promise<WorkoutAndSets | null | PostgrestError> {
	const workout = await routinesService.postWorkout({
		date,
		note,
		routineDayId
	})

	if (!workout || isPostgrestError(workout)) return workout

	const sets = await routinesService.postWorkoutSetsBulk({
		workoutId: workout.id,
		draftSets
	})

	if (!sets || isPostgrestError(sets)) return sets
	return { workout, sets }
}

async function updateWorkoutAndSets({
	workout,
	insertSets,
	upsertSets,
	deleteSets
}: UpdateWorkoutAndSetsParams): Promise<
	WorkoutAndSets | null | PostgrestError
> {
	const workoutResult = await routinesService.updateWorkout(workout)
	if (!workoutResult || isPostgrestError(workoutResult)) return workoutResult

	let upsertResult: DatabaseWorkoutSet[] | PostgrestError = []
	if (upsertSets.length > 0)
		upsertResult = await routinesService.upsertSetsBulk(upsertSets)

	let insertResult: DatabaseWorkoutSet[] | PostgrestError = []
	if (insertSets.length > 0)
		insertResult = await routinesService.postWorkoutSetsBulk({
			workoutId: workout.id,
			draftSets: insertSets
		})

	if (isPostgrestError(upsertResult)) return upsertResult
	if (isPostgrestError(insertResult)) return insertResult

	return {
		workout: workoutResult,
		sets: [...upsertResult, ...insertResult]
	}
}

async function updateWorkoutSets({
	workoutId,
	insertSets,
	upsertSets,
	deleteSets
}: UpdateWorkoutSetsParams): Promise<DatabaseWorkoutSet[] | PostgrestError> {
	let deleteResult: number | PostgrestError = 0
	if (deleteSets.length > 0)
		deleteResult = await routinesService.deleteWorkoutSetsByIds(
			deleteSets.map((s) => s.id)
		)

	let insertResult: DatabaseWorkoutSet[] | PostgrestError = []
	if (insertSets.length > 0)
		insertResult = await routinesService.postWorkoutSetsBulk({
			workoutId: workoutId,
			draftSets: insertSets
		})

	let upsertResult: DatabaseWorkoutSet[] | PostgrestError = []
	if (upsertSets.length > 0)
		upsertResult = await routinesService.upsertSetsBulk(upsertSets)

	if (isPostgrestError(deleteResult)) return deleteResult
	if (isPostgrestError(upsertResult)) return upsertResult
	if (isPostgrestError(insertResult)) return insertResult

	return [...upsertResult, ...insertResult]
}

async function deleteWorkout(wId: number): Promise<number | PostgrestError> {
	const setsResult = routinesService.deleteAllWorkoutSets(wId)
	console.log("sets: ", setsResult)
	if (!setsResult || isPostgrestError(setsResult)) return setsResult

	return routinesService.deleteWorkout(wId)
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

type UpdateWorkoutAndSetsParams = {
	workout: DatabaseWorkout
	insertSets: DraftWorkoutSet[]
	upsertSets: DatabaseWorkoutSet[]
	deleteSets: DatabaseWorkoutSet[]
}

type UpdateWorkoutSetsParams = {
	workoutId: number
	insertSets: DraftWorkoutSet[]
	upsertSets: DatabaseWorkoutSet[]
	deleteSets: DatabaseWorkoutSet[]
}
