import {
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise,
	DraftWorkoutSet,
	ExercisesSets
} from "../../../types/routines"
import { DatabaseProgression } from "../../../types/exercises"
import { FlatList, KeyboardAvoidingView, StyleSheet, View } from "react-native"
import { isPostgrestError } from "../../../utils/queriesHelpers"
import { RootStackNavigationProp } from "../../../navigation/params"
import { sortRDExercisesByOrderAsc } from "../../../utils/sorting"
import { theme } from "../../../resources/theme"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../../stores/useUserStore"
import { WorkoutSchema, WorkoutValues } from "../../../utils/zodSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../../../components/buttons/Button"
import ConfirmationModal from "../../../components/modals/ConfirmationModal"
import ToastNotification from "../../../components/notifications/ToastNotification"
import useExercisesQuery from "../../../hooks/useExercisesQuery"
import useRoutineMutation from "../../../hooks/useRoutineMutation"
import WorkoutExerciseCard from "../../../components/cards/WorkoutExerciseCard"
import WorkoutInput from "../../../components/inputs/WorkoutInput"

type Props = {
	routineDay: DatabaseRoutineDay
	dayExercises: DatabaseRoutineDayExercise[]
}

export default function WorkoutInner({ dayExercises, routineDay }: Props) {
	const { t } = useTranslation()
	const { exercises } = useUserStore()
	const { getProgressionsByExercisesIds } = useExercisesQuery()
	const { createWorkoutAndSetsMutation } = useRoutineMutation()
	const nav = useNavigation<RootStackNavigationProp>()

	const { mutate: createWorkoutAndSets, isPending } =
		createWorkoutAndSetsMutation

	const { data: fetchedProgressions } = getProgressionsByExercisesIds(
		dayExercises.map((de) => de.exercise_id)
	)

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
	const [progressions, setProgressions] = useState<DatabaseProgression[]>([])
	const [exercisesSets, setExercisesSets] = useState<ExercisesSets[]>(
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
			exercisesSets.some((es) =>
				es.sets.some((s) => !s.progressionId || s.progressionId < 0)
			)
		) {
			setConfirmationModalVisible(false)
			ToastNotification({
				title: t("error-messages.progressions-cant-be-empty")
			})
			return
		}

		if (
			exercisesSets.every((es) => es.sets.every((s) => !s.progressionId))
		) {
			setConfirmationModalVisible(false)
			nav.goBack()
			return
		}

		let draftSets: DraftWorkoutSet[] = []

		console.log("1")
		for (let i = 0; i < exercisesSets.length; i++) {
			const es = exercisesSets[i].sets
			draftSets.push(...es)
			for (let j = 0; j < es.length; j++) {
				console.log(
					`${es[j].order} - ${es[j].progressionId} ${es[j].reps}`
				)
			}
		}

		console.log("2 draftsets: ", draftSets)
		createWorkoutAndSets(
			{
				date: date.toISOString(),
				note: note ?? null,
				draftSets,
				routineDayId: routineDay.id
			},
			{
				onSuccess: (workoutAndSets) => {
					console.log("3")
					if (!workoutAndSets || isPostgrestError(workoutAndSets)) {
						ToastNotification({ title: workoutAndSets?.message })
						return
					}
					console.log("4")
					setConfirmationModalVisible(false)
					nav.reset({ index: 0, routes: [{ name: "Home" }] })
				}
			}
		)
		// for (let i = 0; i < exercisesSets.length; i++) {
		// 	console.log("EXERCISE: " + exercisesSets[i].exerciseId)
		// 	for (let j = 0; j < exercisesSets[i].sets.length; j++) {
		// 		console.log(
		// 			`set ${exercisesSets[i].sets[j].order}: ${exercisesSets[i].sets[j].progressionId}`
		// 		)
		// 	}
		// }
	}

	useEffect(() => {
		if (fetchedProgressions && !isPostgrestError(fetchedProgressions))
			setProgressions(fetchedProgressions)
	}, [fetchedProgressions])

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
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
							exercise={exercises.find(
								(e) => e.id === exercise_id
							)}
							exerciseNote={note}
							goals={{
								rep_goal_high,
								rep_goal_low,
								set_goal_low,
								set_goal_high
							}}
							progressions={progressions.filter(
								(p) => p.exercise_id === exercise_id
							)}
							exercisesSets={exercisesSets}
							setExercisesSets={setExercisesSets}
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
