import {
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise,
	ExercisesSets
} from "../../../types/routines"
import { DatabaseProgression } from "../../../types/exercises"
import { FlatList, RefreshControl, StyleSheet, View } from "react-native"
import { isPostgrestError } from "../../../utils/queriesHelpers"
import { sortRDExercisesByOrderAsc } from "../../../utils/sorting"
import { theme } from "../../../resources/theme"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../../stores/useUserStore"
import { WorkoutSchema, WorkoutValues } from "../../../utils/valdiationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../../../components/buttons/Button"
import useExercisesQuery from "../../../hooks/useExercisesQuery"
import WorkoutExerciseCard from "../../../components/cards/WorkoutExerciseCard"
import WorkoutInput from "../../../components/inputs/WorkoutInput"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../navigation/params"

type Props = {
	routineDay: DatabaseRoutineDay
	dayExercises: DatabaseRoutineDayExercise[]
}

export default function WorkoutInner({ dayExercises, routineDay }: Props) {
	const { t } = useTranslation()
	const { exercises } = useUserStore()
	const { getProgressionsByExercisesIds } = useExercisesQuery()
	const nav = useNavigation<RootStackNavigationProp>()

	const { data: fetchedProgressions } = getProgressionsByExercisesIds(
		dayExercises.map((de) => de.exercise_id)
	)

	const { handleSubmit, control } = useForm<WorkoutValues>({
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
				/>
			</View>

			<View style={styles.paddingHorizontal}>
				<WorkoutInput name="note" control={control} date={date} />
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
