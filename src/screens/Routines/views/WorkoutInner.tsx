import {
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise,
	DraftWorkoutSet,
	ExercisesSets
} from "../../../types/routines"
import { DatabaseProgression } from "../../../types/exercises"
import { FlatList, StyleSheet, View } from "react-native"
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
import useExercisesQuery from "../../../hooks/useExercisesQuery"
import WorkoutExerciseCard from "../../../components/cards/WorkoutExerciseCard"
import WorkoutInput from "../../../components/inputs/WorkoutInput"
import useRoutineMutation from "../../../hooks/useRoutineMutation"
import ToastNotification from "../../../components/notifications/ToastNotification"

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

	const [date, setDate] = useState(new Date())
	const [progressions, setProgressions] = useState<DatabaseProgression[]>([])
	const [exercisesSets, setExercisesSets] = useState<ExercisesSets[]>(
		dayExercises.map((de) => ({
			exerciseId: de.exercise_id,
			sets: [{ order: 1, progressionId: undefined, reps: undefined }]
		}))
	)

	function handleGoCreateProgression(eId: number) {
		nav.navigate("EditExercise", {
			id: eId,
			comingFromWorkout: dayExercises.map((de) => de.exercise_id)
		})
	}

	function handleFinishWorkout({ note }: WorkoutValues) {
		if (exercisesSets.every((es) => es.sets.every((s) => !s.progressionId)))
			return

		let draftSets: DraftWorkoutSet[] = []

		for (let i = 0; i < exercisesSets.length; i++) {
			draftSets.concat(exercisesSets[i].sets)
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
		<View style={styles.container}>
			<View style={styles.paddingHorizontal}>
				<Button
					title={t("actions.finish-workout")}
					onPress={handleSubmit(handleFinishWorkout)}
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
				renderItem={({ item }) => (
					<WorkoutExerciseCard
						exercise={exercises.find(
							(e) => e.id === item.exercise_id
						)}
						progressions={progressions.filter(
							(p) => p.exercise_id === item.exercise_id
						)}
						exercisesSets={exercisesSets}
						setExercisesSets={setExercisesSets}
						onCreateProgression={handleGoCreateProgression}
					/>
				)}
				contentContainerStyle={styles.exercisesList}
			/>
		</View>
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
