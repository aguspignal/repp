import exercisesService, {
	PostExerciseParams
} from "../services/exercisesService"
import {
	DatabaseExercise,
	DatabaseProgression,
	DraftProgression,
	ExerciseWithProgressions
} from "../types/exercises"
import {
	handleOnMutationError,
	isPostgrestError
} from "../utils/queriesHelpers"
import { PostgrestError } from "@supabase/supabase-js"
import { useMutation } from "@tanstack/react-query"

export default function useExercisesMutation() {
	const createExerciseAndProgressionsMutation = useMutation({
		mutationFn: async ({
			exerciseData,
			progressions
		}: ExerciseDataAndProgressions): Promise<
			ExerciseWithProgressions | null | PostgrestError
		> => {
			const exercise = await exercisesService.postExercise(exerciseData)

			if (!exercise || isPostgrestError(exercise)) return exercise
			if (progressions.length === 0)
				return {
					exercise,
					progressions: []
				}

			const postedProgressions =
				await exercisesService.postProgressionsBulk({
					exerciseId: exercise.id,
					progressions
				})

			if (isPostgrestError(postedProgressions)) return postedProgressions

			return {
				exercise,
				progressions: postedProgressions
			}
		},
		onError: handleOnMutationError
	})

	const updateExerciseAndProgressionsMutation = useMutation({
		mutationFn: async ({
			exercise,
			deleteProgressionsFromOrder,
			insertProgressions,
			upsertProgressions
		}: UpdateExerciseAndProgressions): Promise<
			UpdateExerciseAndProgressionsResult | null | PostgrestError
		> => {
			const updatedExercise =
				await exercisesService.updateExercise(exercise)

			if (!updatedExercise || isPostgrestError(updatedExercise))
				return updatedExercise

			const progressionsResult = await deleteUpserIntertProgressions({
				exerciseId: exercise.id,
				deleteProgressionsFromOrder,
				insertProgressions,
				upsertProgressions
			})

			if (isPostgrestError(progressionsResult)) return progressionsResult

			return {
				exercise: updatedExercise,
				...progressionsResult
			}
		},
		onError: handleOnMutationError
	})

	const deleteUpsertInsertProgressionsMutation = useMutation({
		mutationFn: async (
			params: DeleteUpsertInsertProgressionsParams
		): Promise<UpdateProgressionsResult | PostgrestError> => {
			return await deleteUpserIntertProgressions(params)
		},
		onError: handleOnMutationError
	})

	const deleteExerciseMutation = useMutation({
		mutationFn: async (id: number) => {
			return await exercisesService.deleteExerciseAndProgressions(id)
		},
		onError: handleOnMutationError
	})

	return {
		createExerciseAndProgressionsMutation,
		updateExerciseAndProgressionsMutation,
		deleteUpsertInsertProgressionsMutation,
		deleteExerciseMutation
	}
}

async function deleteUpserIntertProgressions({
	exerciseId,
	deleteProgressionsFromOrder,
	insertProgressions,
	upsertProgressions
}: DeleteUpsertInsertProgressionsParams): Promise<
	| {
			updatedProgressions: DatabaseProgression[]
			insertedProgressions: DatabaseProgression[]
	  }
	| PostgrestError
> {
	let deleteResult: number | PostgrestError = 0
	if (deleteProgressionsFromOrder !== null)
		deleteResult = await exercisesService.deleteProgressionsFromOrder({
			exerciseId,
			order: deleteProgressionsFromOrder
		})

	let upsertResult: DatabaseProgression[] | PostgrestError = []
	if (upsertProgressions.length > 0)
		upsertResult = await exercisesService.upsertProgressions({
			progressions: upsertProgressions
		})

	let insertResult: DatabaseProgression[] | PostgrestError = []
	if (insertProgressions.length > 0)
		insertResult = await exercisesService.postProgressionsBulk({
			exerciseId,
			progressions: insertProgressions
		})

	if (isPostgrestError(deleteResult)) return deleteResult
	if (isPostgrestError(upsertResult)) return upsertResult
	if (isPostgrestError(insertResult)) return insertResult

	return {
		updatedProgressions: upsertResult,
		insertedProgressions: insertResult
	}
}

type ExerciseDataAndProgressions = {
	exerciseData: PostExerciseParams
	progressions: DraftProgression[]
}

type UpdateExerciseAndProgressions = {
	exercise: DatabaseExercise
	upsertProgressions: DatabaseProgression[]
	insertProgressions: DraftProgression[]
	deleteProgressionsFromOrder: number | null
}

type DeleteUpsertInsertProgressionsParams = {
	exerciseId: number
	upsertProgressions: DatabaseProgression[]
	insertProgressions: DraftProgression[]
	deleteProgressionsFromOrder: number | null
}

type UpdateExerciseAndProgressionsResult = {
	exercise: DatabaseExercise
	updatedProgressions: DatabaseProgression[]
	insertedProgressions: DatabaseProgression[]
}

type UpdateProgressionsResult = {
	updatedProgressions: DatabaseProgression[]
	insertedProgressions: DatabaseProgression[]
}
