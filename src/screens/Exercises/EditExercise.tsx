import {
	DatabaseExercise,
	DatabaseProgression,
	ExerciseUpdatePayload
} from "../../types/exercises"
import useExercisesQuery, {
	GETEXERCISEANDPROGRESSIONSBYID_KEY,
	GETUSEREXERCISESANDPROGRESSIONSLAZY_KEY
} from "../../hooks/useExercisesQuery"
import {
	ExercisesTabScreenProps,
	RootStackNavigationProp
} from "../../navigation/params"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import ErrorScreen from "../ErrorScreen"
import ExerciseInner from "./views/ExerciseInner"
import Loading from "../Loading"
import ToastNotification from "../../components/notifications/ToastNotification"
import useExercisesMutation from "../../hooks/useExercisesMutation"
import { useNavigation } from "@react-navigation/native"

export default function EditExercise({
	navigation,
	route
}: ExercisesTabScreenProps<"EditExercise">) {
	const { t } = useTranslation()
	const { user, addExercise, updateExerciseAndProgressions } = useUserStore()
	const { getExerciseAndProgressionsById } = useExercisesQuery()
	const {
		updateExerciseAndProgressionsMutation,
		deleteUpsertInsertProgressionsMutation
	} = useExercisesMutation()
	const nav = useNavigation<RootStackNavigationProp>()

	const { data, error, isPending } = getExerciseAndProgressionsById(
		route.params.id
	)

	const {
		mutate: updateExerciseAndProgressionsMut,
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
	}: ExerciseUpdatePayload) {
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

						onMutationSuccess(
							data.exercise,
							newProgressions.updatedProgressions,
							newProgressions.insertedProgressions,
							deleteProgressionsFromOrder ?? undefined
						)
					}
				}
			)
			return
		}

		updateExerciseAndProgressionsMut(
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

					onMutationSuccess(
						newExerciseAndProgressions.exercise,
						newExerciseAndProgressions.updatedProgressions,
						newExerciseAndProgressions.insertedProgressions,
						deleteProgressionsFromOrder ?? undefined
					)
				}
			}
		)
	}

	function onMutationSuccess(
		updatedExercise: DatabaseExercise,
		updatedProgressions: DatabaseProgression[],
		insertedProgressions: DatabaseProgression[],
		deleteFromOrder: number | undefined
	) {
		if (!user) return

		console.log(updatedExercise)
		console.log(updatedProgressions)
		console.log(insertedProgressions)
		console.log(deleteFromOrder)
		updateExerciseAndProgressions(
			updatedExercise,
			updatedProgressions,
			insertedProgressions,
			deleteFromOrder
		)
		invalidateQueries(GETUSEREXERCISESANDPROGRESSIONSLAZY_KEY(user.id))
		invalidateQueries(GETEXERCISEANDPROGRESSIONSBYID_KEY(route.params.id))

		if (route.params.comingFromWorkout) {
			navigation.goBack()
			return
		}

		nav.reset({
			index: 0,
			routes: [
				{
					name: "Tabs",
					params: {
						screen: "ExercisesTab",
						params: {
							screen: "ExerciseRepository",
							params: {
								editingRoutineDayId: undefined
							}
						}
					}
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
			exerciseData={data && !isPostgrestError(data) ? data : null}
			onSubmit={onSaveChanges}
			isPendingAction={
				isPendingUpdateExerciseAndProgressions ||
				isPendingUpdateProgressions
			}
		/>
	)
}
