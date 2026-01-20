import {
	handleOnMutationError,
	isPostgrestError
} from "../utils/queriesHelpers"
import {
	DatabaseWorkout,
	DatabaseWorkoutSet,
	DraftWorkoutSet,
	WorkoutWithSets
} from "../types/workouts"
import { PostgrestError } from "@supabase/supabase-js"
import { useMutation } from "@tanstack/react-query"
import workoutsService from "../services/workoutsService"

export default function useWorkoutMutation() {
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

	const deleteWorkoutMutation = useMutation({
		mutationFn: deleteWorkout,
		onError: handleOnMutationError
	})

	return {
		createWorkoutAndSetsMutation,
		updateWorkoutAndSetsMutation,
		updateWorkoutSetsMutation,
		deleteWorkoutMutation
	}
}

async function createWorkoutAndSets({
	date,
	draftSets,
	note,
	routineDayId
}: PostWorkoutAndSetsParams): Promise<WorkoutWithSets | null | PostgrestError> {
	const workout = await workoutsService.postWorkout({
		date,
		note,
		routineDayId
	})

	if (!workout || isPostgrestError(workout)) return workout

	const sets = await workoutsService.postWorkoutSetsBulk({
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
	WorkoutWithSets | null | PostgrestError
> {
	const workoutResult = await workoutsService.updateWorkout(workout)
	if (!workoutResult || isPostgrestError(workoutResult)) return workoutResult

	let upsertResult: DatabaseWorkoutSet[] | PostgrestError = []
	if (upsertSets.length > 0)
		upsertResult = await workoutsService.upsertSetsBulk(upsertSets)

	let insertResult: DatabaseWorkoutSet[] | PostgrestError = []
	if (insertSets.length > 0)
		insertResult = await workoutsService.postWorkoutSetsBulk({
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
		deleteResult = await workoutsService.deleteWorkoutSetsByIds(
			deleteSets.map((s) => s.id)
		)

	let insertResult: DatabaseWorkoutSet[] | PostgrestError = []
	if (insertSets.length > 0)
		insertResult = await workoutsService.postWorkoutSetsBulk({
			workoutId: workoutId,
			draftSets: insertSets
		})

	let upsertResult: DatabaseWorkoutSet[] | PostgrestError = []
	if (upsertSets.length > 0)
		upsertResult = await workoutsService.upsertSetsBulk(upsertSets)

	if (isPostgrestError(deleteResult)) return deleteResult
	if (isPostgrestError(upsertResult)) return upsertResult
	if (isPostgrestError(insertResult)) return insertResult

	return [...upsertResult, ...insertResult]
}

async function deleteWorkout(wId: number): Promise<number | PostgrestError> {
	const setsResult = workoutsService.deleteAllWorkoutSets(wId)
	console.log("sets: ", setsResult)
	if (!setsResult || isPostgrestError(setsResult)) return setsResult

	return workoutsService.deleteWorkout(wId)
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
