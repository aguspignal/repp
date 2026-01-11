import useExercisesQuery, {
	GETUSEREXERCISESLAZY_KEY,
	GETEXERCISEANDPROGRESSIONSBYID_KEY,
	GETPROGRESSIONSBYEXERCISESIDS_KEY
} from "../../hooks/useExercisesQuery"
import {
	DatabaseExercise,
	DraftExerciseAndProgression
} from "../../types/exercises"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
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
	const { user, addExercise } = useUserStore()
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
					onSuccess: (result) => {
						if (isPostgrestError(result)) {
							ToastNotification({
								description: t(
									"error-messages.trouble-getting-exercise"
								)
							})
							return
						}

						onMutationSuccess()
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
				onSuccess: (newExercise) => {
					if (!newExercise || isPostgrestError(newExercise)) {
						ToastNotification({
							description: t(
								"error-messages.trouble-getting-exercise"
							)
						})
						return
					}

					onMutationSuccess(newExercise)
				}
			}
		)
	}

	function onMutationSuccess(newExercise?: DatabaseExercise) {
		if (!user) return

		if (newExercise) addExercise(newExercise)

		invalidateQueries(GETEXERCISEANDPROGRESSIONSBYID_KEY(route.params.id))
		invalidateQueries(GETUSEREXERCISESLAZY_KEY(user.id))

		if (route.params.comingFromWorkout) {
			invalidateQueries(
				GETPROGRESSIONSBYEXERCISESIDS_KEY(
					route.params.comingFromWorkout
				)
			)
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

	if (isPending) return <Loading />
	if (error) return <ErrorScreen errorMessage={error.message} />
	if (isPostgrestError(data))
		return <ErrorScreen errorMessage={data.message} />

	return (
		<ExerciseInner
			type="edit"
			exerciseData={data}
			onSubmit={onSaveChanges}
			isPendingAction={
				isPendingUpdateExerciseAndProgressions ||
				isPendingUpdateProgressions
			}
		/>
	)
}
