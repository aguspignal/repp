import {
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise
} from "../../../types/routines"
import {
	FlatList,
	KeyboardAvoidingView,
	ListRenderItem,
	StyleSheet,
	View
} from "react-native"
import {
	mapWorkoutAndSetsToDraftWorkoutExerciseSets,
	mapWorkoutDataToDraftWorkoutExerciseSets
} from "../../../utils/parsing"
import {
	DatabaseWorkoutSet,
	DraftWorkoutSet,
	ExerciseIdWithDraftSets,
	WorkoutUpdatePayload,
	WorkoutWithSets
} from "../../../types/workouts"
import { areDraftWorkoutExerciseSetsInvalid } from "../../../utils/validation"
import { RootStackNavigationProp } from "../../../navigation/params"
import { sortRDExercisesByOrderAsc } from "../../../utils/sorting"
import { theme } from "../../../resources/theme"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../../stores/useUserStore"
import { WorkoutSchema, WorkoutValues } from "../../../utils/zodSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../../../components/buttons/Button"
import ConfirmationModal from "../../../components/modals/ConfirmationModal"
import ToastNotification from "../../../components/notifications/ToastNotification"
import useKeyboardBehaviour from "../../../hooks/useKeyboardBehaviour"
import WorkoutExerciseCard from "../../../components/cards/WorkoutExerciseCard"
import WorkoutInput from "../../../components/inputs/WorkoutInput"

type Props = {
	routineDay: DatabaseRoutineDay
	dayExercises: DatabaseRoutineDayExercise[]
	workoutData: WorkoutWithSets | null
	onSubmit: (params: WorkoutUpdatePayload) => void
	isLoadingAction: boolean
}

export default function WorkoutInner({
	dayExercises,
	routineDay,
	workoutData,
	onSubmit,
	isLoadingAction
}: Props) {
	const { t } = useTranslation()
	const { behaviour } = useKeyboardBehaviour()
	const { exercises } = useUserStore()
	const nav = useNavigation<RootStackNavigationProp>()

	const {
		handleSubmit,
		control,
		formState: { isSubmitting, isValidating }
	} = useForm<WorkoutValues>({
		defaultValues: { note: workoutData?.workout.note ?? "" },
		resolver: zodResolver(WorkoutSchema)
	})

	const [confirmationModalVisible, setConfirmationModalVisible] =
		useState(false)
	const [date, setDate] = useState(
		workoutData?.workout.date
			? new Date(workoutData.workout.date)
			: new Date()
	)
	const [workoutSets, setWorkoutSets] = useState<ExerciseIdWithDraftSets[]>(
		mapWorkoutAndSetsToDraftWorkoutExerciseSets(
			dayExercises,
			exercises,
			workoutData
		)
	)

	function handleGoCreateProgression(eId: number) {
		nav.navigate("EditExercise", {
			id: eId,
			comingFromWorkout: dayExercises.map((de) => de.exercise_id)
		})
	}

	function mapSetChanges() {
		if (!workoutData)
			return {
				upsertSets: [],
				insertSets: [],
				deleteSets: []
			}

		const upsertSets: DatabaseWorkoutSet[] = workoutSets.flatMap((ws) => {
			const thisExercise = exercises.find(
				(e) => e.exercise.id === ws.exerciseId
			)

			return ws.sets.flatMap((newSet) => {
				const oldSet: DatabaseWorkoutSet | undefined =
					workoutData.sets.find(
						(s) =>
							thisExercise?.progressions.some(
								(p) => p.id === s.progression_id
							) && s.order === newSet.order
					)

				if (!oldSet) return []
				if (
					oldSet.order === newSet.order &&
					oldSet.progression_id === newSet.progression_id &&
					oldSet.reps === newSet.reps
				)
					return []

				return {
					...oldSet,
					order: newSet.order,
					progression_id:
						newSet.progression_id ?? oldSet.progression_id,
					reps: newSet.reps ?? oldSet.reps
				}
			})
		})

		const insertSets: DraftWorkoutSet[] = workoutSets.flatMap((ws) => {
			const thisExercise = exercises.find(
				(e) => e.exercise.id === ws.exerciseId
			)

			const oldSetsCount = workoutData.sets.filter((s) =>
				thisExercise?.progressions.some(
					(p) => p.id === s.progression_id
				)
			).length

			return ws.sets.length > oldSetsCount
				? ws.sets.slice(oldSetsCount - 1)
				: []
		})

		const deleteSets: DatabaseWorkoutSet[] = workoutSets.flatMap((ws) => {
			const thisExercise = exercises.find(
				(e) => e.exercise.id === ws.exerciseId
			)

			const thisExerciseOldSets = workoutData.sets.filter((s) =>
				thisExercise?.progressions.some(
					(p) => p.id === s.progression_id
				)
			)

			return ws.sets.length < thisExerciseOldSets.length
				? thisExerciseOldSets.slice(ws.sets.length)
				: []
		})

		return { upsertSets, insertSets, deleteSets }
	}

	function handleFinishWorkout({ note }: WorkoutValues) {
		if (areDraftWorkoutExerciseSetsInvalid(workoutSets)) {
			setConfirmationModalVisible(false)
			ToastNotification({
				title: t("error-messages.progressions-cant-be-empty")
			})
			return
		}

		if (!workoutData) {
			onSubmit({
				draftWorkout: {
					date: date.toISOString(),
					note: note ?? null,
					routineday_id: routineDay.id
				},
				insertSets: workoutSets.flatMap((ws) => ws.sets),
				upsertSets: [],
				deleteSets: []
			})
			setConfirmationModalVisible(false)
			return
		}

		const oldWorkoutSets = mapWorkoutDataToDraftWorkoutExerciseSets(
			workoutData,
			exercises
		)

		if (JSON.stringify(workoutSets) === JSON.stringify(oldWorkoutSets)) {
			setConfirmationModalVisible(false)
			nav.goBack()
			return
		}

		const mappedSets = mapSetChanges()
		if (!mappedSets) {
			setConfirmationModalVisible(false)
			nav.goBack()
			return
		}

		onSubmit({
			draftWorkout: {
				date: date.toISOString(),
				note: note ?? null,
				routineday_id: routineDay.id
			},
			insertSets: mappedSets.insertSets,
			upsertSets: mappedSets.upsertSets,
			deleteSets: mappedSets.deleteSets
		})
		setConfirmationModalVisible(false)
	}

	const renderItem = useCallback<ListRenderItem<DatabaseRoutineDayExercise>>(
		({ item }) => {
			const exercise = exercises.find(
				(e) => e.exercise.id === item.exercise_id
			)
			if (!exercise) return null

			return (
				<WorkoutExerciseCard
					exerciseAndProgressions={exercise}
					exerciseNote={item.note}
					goals={{
						rep_goal_high: item.rep_goal_high,
						rep_goal_low: item.rep_goal_low,
						set_goal_low: item.set_goal_low,
						set_goal_high: item.set_goal_high
					}}
					workoutSets={workoutSets}
					setWorkoutSets={setWorkoutSets}
					onCreateProgression={handleGoCreateProgression}
				/>
			)
		},
		[exercises, workoutSets]
	)

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={behaviour}>
			<View style={styles.container}>
				<View style={styles.paddingHorizontal}>
					<Button
						title={t("actions.finish-workout")}
						onPress={() => setConfirmationModalVisible(true)}
						isLoading={
							isLoadingAction || isSubmitting || isValidating
						}
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
					renderItem={renderItem}
					contentContainerStyle={styles.exercisesList}
				/>

				<ConfirmationModal
					isVisible={confirmationModalVisible}
					setIsVisible={setConfirmationModalVisible}
					title={t("questions.sure-want-to-finish-workout")}
					confirmText={t("actions.finish-workout")}
					onConfirm={handleSubmit(handleFinishWorkout)}
					onCancel={() => setConfirmationModalVisible(false)}
					isLoadingConfirm={isLoadingAction}
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
