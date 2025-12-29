import useExercisesQuery, {
	GETUSEREXERCISESLAZY_KEY,
	GETEXERCISEANDPROGRESSIONSBYID_KEY
} from "../../hooks/useExercisesQuery"
import { DraftExerciseAndProgression } from "../../types/exercises"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import ErrorScreen from "../ErrorScreen"
import ExerciseInner from "./views/ExerciseInner"
import Loading from "../Loading"
import ToastNotification from "../../components/notifications/ToastNotification"
import useExercisesMutation from "../../hooks/useExercisesMutation"

export function CreateExercise({
	navigation
}: RootStackScreenProps<"CreateExercise">) {
	const { t } = useTranslation()
	const { user, addExercise } = useUserStore()
	const { createExerciseAndProgressionsMutation } = useExercisesMutation()

	const { mutate: createExerciseAndProgressions, isPending } =
		createExerciseAndProgressionsMutation

	function onCreateExercise({
		draftExercise,
		progressions
	}: DraftExerciseAndProgression) {
		if (!user) return

		createExerciseAndProgressions(
			{
				exerciseData: {
					userId: user.id,
					name: draftExercise.name,
					description: draftExercise.description ?? "",
					isBodyweight: draftExercise.is_bodyweight,
					isFreeweight: draftExercise.is_freeweight,
					isIsometric: draftExercise.is_isometric
				},
				progressions: progressions.map((p) => ({
					name: p.name,
					order: p.order,
					is_weighted: p.is_weighted,
					weight: p.weight
				}))
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

					addExercise(newExercise)
					invalidateQueries(GETUSEREXERCISESLAZY_KEY(user.id))
					navigation.reset({
						index: 0,
						routes: [
							{ name: "Home" },
							{ name: "ExerciseRepository" }
						]
					})
				}
			}
		)
	}

	return (
		<ExerciseInner
			type="create"
			exerciseData={null}
			onSubmit={onCreateExercise}
			isPendingAction={isPending}
		/>
	)
}

export function EditExercise({
	navigation,
	route
}: RootStackScreenProps<"EditExercise">) {
	const { t } = useTranslation()
	const { user, addExercise } = useUserStore()
	const { getExerciseAndProgressionsById } = useExercisesQuery()
	const {
		updateExerciseAndProgressionsMutation,
		updateProgressionsMutation
	} = useExercisesMutation()

	const { data, error, isPending } = getExerciseAndProgressionsById(
		route.params.id
	)

	const {
		mutate: updateExerciseAndProgressions,
		isPending: isPendingUpdate
	} = updateExerciseAndProgressionsMutation

	const {
		mutate: updateProgressions,
		isPending: isPendingUpdateProgressions
	} = updateProgressionsMutation

	function onSaveChanges({
		draftExercise,
		progressions
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
			updateProgressions(
				{
					exerciseId: data.exercise.id,
					progressions
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

						invalidateQueries(
							GETEXERCISEANDPROGRESSIONSBYID_KEY(route.params.id)
						)
						invalidateQueries(GETUSEREXERCISESLAZY_KEY(user.id))
						navigation.reset({
							index: 0,
							routes: [
								{ name: "Home" },
								{ name: "ExerciseRepository" }
							]
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
				progressions
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

					addExercise(newExercise)
					invalidateQueries(
						GETEXERCISEANDPROGRESSIONSBYID_KEY(route.params.id)
					)
					invalidateQueries(GETUSEREXERCISESLAZY_KEY(user.id))
					navigation.reset({
						index: 0,
						routes: [
							{ name: "Home" },
							{ name: "ExerciseRepository" }
						]
					})
				}
			}
		)
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
			isPendingAction={isPendingUpdate || isPendingUpdateProgressions}
		/>
	)
}
