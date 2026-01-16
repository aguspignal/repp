import {
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise,
	DraftWorkoutSet,
	ExercisesSets
} from "../../../types/routines"
import { FlatList, KeyboardAvoidingView, StyleSheet, View } from "react-native"
import { isPostgrestError } from "../../../utils/queriesHelpers"
import { RootStackNavigationProp } from "../../../navigation/params"
import { sortRDExercisesByOrderAsc } from "../../../utils/sorting"
import { theme } from "../../../resources/theme"
import { useForm } from "react-hook-form"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../../stores/useUserStore"
import { WorkoutSchema, WorkoutValues } from "../../../utils/zodSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../../../components/buttons/Button"
import ConfirmationModal from "../../../components/modals/ConfirmationModal"
import ToastNotification from "../../../components/notifications/ToastNotification"
import useKeyboardBehaviour from "../../../hooks/useKeyboardBehaviour"
import useRoutineMutation from "../../../hooks/useRoutineMutation"
import WorkoutExerciseCard from "../../../components/cards/WorkoutExerciseCard"
import WorkoutInput from "../../../components/inputs/WorkoutInput"

type Props = {
	routineDay: DatabaseRoutineDay
	dayExercises: DatabaseRoutineDayExercise[]
}

export default function WorkoutInner({ dayExercises, routineDay }: Props) {
	const { t } = useTranslation()
	const { behaviour } = useKeyboardBehaviour()
	const { exercises } = useUserStore()
	const { createWorkoutAndSetsMutation } = useRoutineMutation()
	const nav = useNavigation<RootStackNavigationProp>()

	const { mutate: createWorkoutAndSets, isPending } =
		createWorkoutAndSetsMutation

	const {
		handleSubmit,
		control,
		formState: { isSubmitting, isValidating }
	} = useForm<WorkoutValues>({
		resolver: zodResolver(WorkoutSchema)
	})

	const [confirmationModalVisible, setConfirmationModalVisible] =
		useState(false)
	const [date, setDate] = useState(new Date())
	const [workoutSets, setWorkoutSets] = useState<ExercisesSets[]>(
		dayExercises.map((de) => ({
			exerciseId: de.exercise_id,
			sets: [{ order: 1, progressionId: null, reps: null }]
		}))
	)

	function handleGoCreateProgression(eId: number) {
		nav.navigate("EditExercise", {
			id: eId,
			comingFromWorkout: dayExercises.map((de) => de.exercise_id)
		})
	}

	function handleFinishWorkout({ note }: WorkoutValues) {
		if (
			workoutSets.some((es) =>
				es.sets.some((s) => !s.progressionId || s.progressionId < 0)
			)
		) {
			setConfirmationModalVisible(false)
			ToastNotification({
				title: t("error-messages.progressions-cant-be-empty")
			})
			return
		}

		if (workoutSets.every((es) => es.sets.every((s) => !s.progressionId))) {
			setConfirmationModalVisible(false)
			nav.goBack()
			return
		}

		let draftSets: DraftWorkoutSet[] = []

		for (let i = 0; i < workoutSets.length; i++) {
			const es = workoutSets[i].sets
			draftSets.push(...es)
			for (let j = 0; j < es.length; j++) {
				console.log(
					`${es[j].order} - ${es[j].progressionId} ${es[j].reps}`
				)
			}
		}

		createWorkoutAndSets(
			{
				date: date.toISOString(),
				note: note ?? null,
				draftSets,
				routineDayId: routineDay.id
			},
			{
				onSuccess: (workoutAndSets) => {
					if (!workoutAndSets || isPostgrestError(workoutAndSets)) {
						ToastNotification({ title: workoutAndSets?.message })
						return
					}

					setConfirmationModalVisible(false)
					nav.reset({ index: 0, routes: [{ name: "Home" }] })
				}
			}
		)
	}

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={behaviour}>
			<View style={styles.container}>
				<View style={styles.paddingHorizontal}>
					<Button
						title={t("actions.finish-workout")}
						onPress={() => setConfirmationModalVisible(true)}
						isLoading={isPending || isSubmitting || isValidating}
					/>
				</View>

				<View style={styles.paddingHorizontal}>
					<WorkoutInput
						name="note"
						control={control}
						date={date}
						setDate={setDate}
					/>
				</View>

				<FlatList
					data={sortRDExercisesByOrderAsc(dayExercises)}
					renderItem={({
						item: {
							exercise_id,
							note,
							rep_goal_high,
							rep_goal_low,
							set_goal_high,
							set_goal_low
						}
					}) => (
						<WorkoutExerciseCard
							exerciseAndProgressions={
								exercises.find(
									(e) => e.exercise.id === exercise_id
								)!
							}
							exerciseNote={note}
							goals={{
								rep_goal_high,
								rep_goal_low,
								set_goal_low,
								set_goal_high
							}}
							workoutSets={workoutSets}
							setWorkoutSets={setWorkoutSets}
							onCreateProgression={handleGoCreateProgression}
						/>
					)}
					contentContainerStyle={styles.exercisesList}
				/>

				<ConfirmationModal
					isVisible={confirmationModalVisible}
					setIsVisible={setConfirmationModalVisible}
					title={t("questions.sure-want-to-finish-workout")}
					confirmText={t("actions.finish-workout")}
					onConfirm={handleSubmit(handleFinishWorkout)}
					onCancel={() => setConfirmationModalVisible(false)}
					isLoadingConfirm={isPending}
				/>
			</View>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		paddingTop: theme.spacing.s,
		gap: theme.spacing.s
	},
	paddingHorizontal: {
		paddingHorizontal: theme.spacing.s
	},
	exercisesList: {
		gap: theme.spacing.xl,
		paddingBottom: theme.spacing.xxl
	}
})
