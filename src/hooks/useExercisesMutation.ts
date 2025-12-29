import exercisesService, {
	PostExerciseParams
} from "../services/exercisesService"
import {
	DatabaseExercise,
	DatabaseProgression,
	DraftProgression
} from "../types/exercises"
import { isPostgrestError } from "../utils/queriesHelpers"
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
		onError: handleOnError
	})

	const updateExerciseAndProgressionsMutation = useMutation({
		mutationFn: async ({
			exercise,
			progressions
		}: ExerciseAndProgressions) => {
			const updatedExercise = await exercisesService.updateExercise(
				exercise
			)

			if (!updatedExercise || isPostgrestError(updatedExercise))
				return updatedExercise

			const progressionsResult =
				await exercisesService.deleteAndInsertProgressionsBulk({
					exerciseId: updatedExercise.id,
					progressions: progressions.map((p) => ({
						name: p.name,
						order: p.order,
						is_weighted: p.is_weighted,
						weight: p.weight
					}))
				})

			if (isPostgrestError(progressionsResult)) {
				console.log(progressionsResult.message)
				ToastNotification({ title: progressionsResult.message })
				return
			}

			return updatedExercise
		},
		onError: handleOnError
	})

	const updateProgressionsMutation = useMutation({
		mutationFn: async ({
			exerciseId,
			progressions
		}: UpdateProgressionsParams) => {
			return await exercisesService.deleteAndInsertProgressionsBulk({
				exerciseId: exerciseId,
				progressions: progressions.map((p) => ({
					name: p.name,
					order: p.order,
					is_weighted: p.is_weighted,
					weight: p.weight
				}))
			})
		},
		onError: handleOnError
	})

	const deleteExerciseMutation = useMutation({
		mutationFn: async (id: number) => {
			return await exercisesService.deleteExerciseAndProgressions(id)
		},
		onError: handleOnError
	})

	return {
		createExerciseAndProgressionsMutation,
		updateExerciseAndProgressionsMutation,
		updateProgressionsMutation,
		deleteExerciseMutation
	}
}

function handleOnError(error: Error) {
	console.log(error)
	ToastNotification({
		title: i18next.t("error-messages.an-error-ocurred-try-again")
	})
}

type ExerciseDataAndProgressions = {
	exerciseData: PostExerciseParams
	progressions: DraftProgression[]
}

type ExerciseAndProgressions = {
	exercise: DatabaseExercise
	progressions: DatabaseProgression[]
}

type UpdateProgressionsParams = {
	exerciseId: number
	progressions: DatabaseProgression[]
}
