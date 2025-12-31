import exercisesService, {
	PostExerciseParams
} from "../services/exercisesService"
import {
	DatabaseExercise,
	DatabaseProgression,
	DraftProgression
} from "../types/exercises"
import {
	handleOnMutationError,
	isPostgrestError
} from "../utils/queriesHelpers"
import { useMutation } from "@tanstack/react-query"
import i18next from "i18next"
import ToastNotification from "../components/notifications/ToastNotification"

export default function useExercisesMutation() {
	const createExerciseAndProgressionsMutation = useMutation({
		mutationFn: async ({
			exerciseData,
			progressions
		}: ExerciseDataAndProgressions) => {
			const exercise = await exercisesService.postExercise(exerciseData)

			if (
				!exercise ||
				isPostgrestError(exercise) ||
				progressions.length === 0
			)
				return exercise

			const progResult = await exercisesService.postProgressionsBulk({
				exerciseId: exercise.id,
				progressions
			})

			if (!progResult || isPostgrestError(progResult))
				ToastNotification({
					title: i18next.t(
						"error-messages.trouble-getting-progressions"
					)
				})

			return exercise
		},
		onError: handleOnMutationError
	})

	const updateExerciseAndProgressionsMutation = useMutation({
		mutationFn: async ({
			exercise,
			deleteProgressionsFromOrder,
			insertProgressions,
			upsertProgressions
		}: ExerciseAndProgressions) => {
			const updatedExercise = await exercisesService.updateExercise(
				exercise
			)

			if (!updatedExercise || isPostgrestError(updatedExercise))
				return updatedExercise

			if (deleteProgressionsFromOrder)
				await exercisesService.deleteProgressionsFromOrder({
					exerciseId: exercise.id,
					order: deleteProgressionsFromOrder
				})

			if (upsertProgressions.length > 0)
				await exercisesService.upsertProgressions({
					progressions: upsertProgressions
				})

			if (insertProgressions.length > 0)
				await exercisesService.postProgressionsBulk({
					exerciseId: exercise.id,
					progressions: insertProgressions
				})

			return updatedExercise
		},
		onError: handleOnMutationError
	})

	const deleteUpsertInsertProgressionsMutation = useMutation({
		mutationFn: async ({
			exerciseId,
			deleteProgressionsFromOrder,
			insertProgressions,
			upsertProgressions
		}: DeleteUpsertInsertProgressionsParams) => {
			if (
				!deleteProgressionsFromOrder &&
				!upsertProgressions.length &&
				!insertProgressions.length
			)
				return 0

			let deleteResult = null
			if (deleteProgressionsFromOrder)
				deleteResult =
					await exercisesService.deleteProgressionsFromOrder({
						exerciseId,
						order: deleteProgressionsFromOrder
					})

			let upsertResult = null
			if (upsertProgressions.length > 0)
				upsertResult = await exercisesService.upsertProgressions({
					progressions: upsertProgressions
				})

			let insertResult = null
			if (insertProgressions.length > 0)
				insertResult = await exercisesService.postProgressionsBulk({
					exerciseId,
					progressions: insertProgressions
				})

			if (isPostgrestError(deleteResult)) {
				console.log(deleteResult)
				return deleteResult
			}
			if (isPostgrestError(upsertResult)) {
				console.log(upsertResult)
				return upsertResult
			}
			if (isPostgrestError(insertResult)) {
				console.log(insertResult)
				return insertResult
			}
			return (
				(deleteResult ?? 0) + (upsertResult ?? 0) + (insertResult ?? 0)
			)
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

type ExerciseDataAndProgressions = {
	exerciseData: PostExerciseParams
	progressions: DraftProgression[]
}

type ExerciseAndProgressions = {
	exercise: DatabaseExercise
	// progressions: DatabaseProgression[]
	upsertProgressions: DatabaseProgression[]
	insertProgressions: DraftProgression[]
	deleteProgressionsFromOrder: number | null
}

type UpdateProgressionsParams = {
	exerciseId: number
	progressions: DatabaseProgression[]
}

type DeleteUpsertInsertProgressionsParams = {
	exerciseId: number
	upsertProgressions: DatabaseProgression[]
	insertProgressions: DraftProgression[]
	deleteProgressionsFromOrder: number | null
}
