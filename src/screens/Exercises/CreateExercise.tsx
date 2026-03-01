import {
	ExercisesTabScreenProps,
	RootStackNavigationProp
} from "../../navigation/params"
import { ExerciseUpdatePayload } from "../../types/exercises"
import { GETUSEREXERCISESANDPROGRESSIONSLAZY_KEY } from "../../hooks/useExercisesQuery"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import ExerciseInner from "./views/ExerciseInner"
import ToastNotification from "../../components/notifications/ToastNotification"
import useExercisesMutation from "../../hooks/useExercisesMutation"

export default function CreateExercise({}: ExercisesTabScreenProps<"CreateExercise">) {
	const { t } = useTranslation()
	const { user, addExercise } = useUserStore()
	const { createExerciseAndProgressionsMutation } = useExercisesMutation()
	const nav = useNavigation<RootStackNavigationProp>()

	const { mutate: createExerciseAndProgressions, isPending } =
		createExerciseAndProgressionsMutation

	function onCreateExercise({
		draftExercise,
		insertProgressions
	}: ExerciseUpdatePayload) {
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
				progressions: insertProgressions
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
						GETUSEREXERCISESANDPROGRESSIONSLAZY_KEY(user.id)
					)
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
