import { DraftExerciseAndProgression } from "../../types/exercises"
import { GETUSEREXERCISESLAZY_KEY } from "../../hooks/useExercisesQuery"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import ExerciseInner from "./views/ExerciseInner"
import ToastNotification from "../../components/notifications/ToastNotification"
import useExercisesMutation from "../../hooks/useExercisesMutation"

export default function CreateExercise({
	navigation
}: RootStackScreenProps<"CreateExercise">) {
	const { t } = useTranslation()
	const { user, addExercise } = useUserStore()
	const { createExerciseAndProgressionsMutation } = useExercisesMutation()

	const { mutate: createExerciseAndProgressions, isPending } =
		createExerciseAndProgressionsMutation

	function onCreateExercise({
		draftExercise,
		insertProgressions
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
