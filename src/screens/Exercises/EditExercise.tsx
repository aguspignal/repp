import {
	DraftExerciseAndProgression,
	ExerciseAndProgressions
} from "../../types/exercises"
import useExercisesQuery, {
	GETEXERCISEANDPROGRESSIONSBYID_KEY,
	GETUSEREXERCISESANDPROGRESSIONSLAZY_KEY
} from "../../hooks/useExercisesQuery"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import ErrorScreen from "../ErrorScreen"
import ExerciseInner from "./views/ExerciseInner"
import Loading from "../Loading"
import ToastNotification from "../../components/notifications/ToastNotification"
import useExercisesMutation from "../../hooks/useExercisesMutation"

export default function EditExercise({
	navigation,
	route
}: RootStackScreenProps<"EditExercise">) {
	const { t } = useTranslation()
	const { user, exercises, addExercise } = useUserStore()
	const { getExerciseAndProgressionsById } = useExercisesQuery()
	const {
		updateExerciseAndProgressionsMutation,
		deleteUpsertInsertProgressionsMutation
	} = useExercisesMutation()

	const { data, error, isPending } = getExerciseAndProgressionsById(
		route.params.id
	)

	const {
		mutate: updateExerciseAndProgressions,
		isPending: isPendingUpdateExerciseAndProgressions
	} = updateExerciseAndProgressionsMutation

	const {
		mutate: deleteUpsertInsertProgressions,
		isPending: isPendingUpdateProgressions
	} = deleteUpsertInsertProgressionsMutation

	function onSaveChanges({
		draftExercise,
		deleteProgressionsFromOrder,
		insertProgressions,
		upsertProgressions
	}: DraftExerciseAndProgression) {
		if (!user || !data || isPostgrestError(data)) return

		const {
			name,
			description,
			is_bodyweight,
			is_freeweight,
			is_isometric
		} = data.exercise

		if (
			draftExercise.name === name &&
			draftExercise.description === description &&
			draftExercise.is_bodyweight === is_bodyweight &&
			draftExercise.is_freeweight === is_freeweight &&
			draftExercise.is_isometric === is_isometric
		) {
			deleteUpsertInsertProgressions(
				{
					exerciseId: data.exercise.id,
					deleteProgressionsFromOrder,
					insertProgressions,
					upsertProgressions
				},
				{
					onSuccess: (newProgressions) => {
						if (isPostgrestError(newProgressions)) {
							ToastNotification({
								description: t(
									"error-messages.trouble-getting-exercise"
								)
							})
							return
						}

						onMutationSuccess({
							exercise: data.exercise,
							progressions: newProgressions
						})
					}
				}
			)
			return
		}

		updateExerciseAndProgressions(
			{
				exercise: {
					...data.exercise,
					name: draftExercise.name,
					description: draftExercise.description ?? "",
					is_bodyweight: draftExercise.is_bodyweight,
					is_freeweight: draftExercise.is_freeweight,
					is_isometric: draftExercise.is_isometric
				},
				deleteProgressionsFromOrder,
				insertProgressions,
				upsertProgressions
			},
			{
				onSuccess: (newExerciseAndProgressions) => {
					if (
						!newExerciseAndProgressions ||
						isPostgrestError(newExerciseAndProgressions)
					) {
						ToastNotification({
							description: t(
								"error-messages.trouble-getting-exercise"
							)
						})
						return
					}

					onMutationSuccess(newExerciseAndProgressions)
				}
			}
		)
	}

	function onMutationSuccess(
		newExerciseAndProgressions: ExerciseAndProgressions
	) {
		if (!user) return

		addExercise(newExerciseAndProgressions)
		invalidateQueries(GETEXERCISEANDPROGRESSIONSBYID_KEY(route.params.id))
		invalidateQueries(GETUSEREXERCISESANDPROGRESSIONSLAZY_KEY(user.id))

		if (route.params.comingFromWorkout) {
			navigation.goBack()
		} else
			navigation.reset({
				index: 0,
				routes: [
					{ name: "Home" },
					{
						name: "ExerciseRepository",
						params: { editingRoutineDayId: undefined }
					}
				]
			})
	}

	useEffect(() => {
		if (data && !isPostgrestError(data)) addExercise(data)
	}, [data])

	if (isPending) return <Loading />
	if (error) return <ErrorScreen errorMessage={error.message} />
	if (isPostgrestError(data))
		return <ErrorScreen errorMessage={data.message} />

	return (
		<ExerciseInner
			type="edit"
			exerciseData={
				exercises.find((e) => e.exercise.id === route.params.id) ?? null
			}
			onSubmit={onSaveChanges}
			isPendingAction={
				isPendingUpdateExerciseAndProgressions ||
				isPendingUpdateProgressions
			}
		/>
	)
}
