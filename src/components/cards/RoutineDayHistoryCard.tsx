import { DatabaseExercise, DatabaseProgression } from "../../types/exercises"
import { DatabaseWorkout, DatabaseWorkoutSet } from "../../types/routines"
import { parseDateToWeekdayMonthDay } from "../../utils/parsing"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import { useMemo, useState } from "react"
import { useUserStore } from "../../stores/useUserStore"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	workout: DatabaseWorkout
	sets: DatabaseWorkoutSet[]
	isFirstInList?: boolean
}
export default function RoutineDayHistoryCard({
	workout,
	sets,
	isFirstInList = false
}: Props) {
	const { exercises } = useUserStore()

	const workoutExercisesProgressionsAndSets = useMemo(() => {
		const exerProgs = exercises.flatMap((e) =>
			sets.some((set) =>
				e.progressions.some((p) => p.id === set.progression_id)
			)
				? e
				: []
		)

		return exerProgs.map((ep) => ({
			exercise: ep.exercise,
			progressions: ep.progressions,
			sets: sets.filter((set) =>
				ep.progressions.some((p) => p.id === set.progression_id)
			)
		}))
	}, [sets, exercises])

	const [showContent, setShowContent] = useState(isFirstInList)

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => setShowContent((prev) => !prev)}
				style={[styles.row, styles.header]}
			>
				<View style={[styles.row, styles.calendarAndDate]}>
					<MCIcon
						name="calendar"
						color={showContent ? "primary" : "textLight"}
						size="xxl"
					/>
					<StyledText
						type="subtitle"
						color={showContent ? "primary" : "textLight"}
					>
						{parseDateToWeekdayMonthDay(new Date(workout.date))}
					</StyledText>
				</View>

				<MCIcon
					name={showContent ? "chevron-up" : "chevron-down"}
					color="grayDark"
				/>
			</TouchableOpacity>

			{showContent ? (
				<View style={styles.contentContainer}>
					{workout.note ? (
						<StyledText type="note">{workout.note}</StyledText>
					) : null}

					{workoutExercisesProgressionsAndSets.map((weps) => (
						<HistoryExercise
							key={weps.exercise.id}
							exercise={weps.exercise}
							progressions={weps.progressions}
							sets={weps.sets}
						/>
					))}
				</View>
			) : null}
		</View>
	)
}

type HistoryExerciseProps = {
	exercise: DatabaseExercise
	progressions: DatabaseProgression[]
	sets: DatabaseWorkoutSet[]
}
function HistoryExercise({
	exercise,
	progressions,
	sets
}: HistoryExerciseProps) {
	return (
		<View>
			<StyledText type="boldText" style={styles.exerciseName}>
				{exercise.name}
			</StyledText>

			<View style={styles.horizontalLine} />

			{sets.map((set) => (
				<View key={set.id} style={[styles.row, styles.setRow]}>
					<StyledText
						type="boldText"
						align="center"
						style={styles.setFlex}
					>
						{set.order}
					</StyledText>

					<StyledText type="text" style={styles.nameFlex}>
						{progressions.find((p) => p.id === set.progression_id)
							?.name ?? "-"}
					</StyledText>

					<StyledText
						type="boldText"
						align="center"
						style={
							set.reps.toString().length > 3
								? styles.repsFlex
								: styles.setFlex
						}
					>
						{set.reps}
					</StyledText>
				</View>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {},
	row: {
		flexDirection: "row",
		alignItems: "center"
	},
	header: {
		justifyContent: "space-between",
		paddingVertical: theme.spacing.xxs
	},
	calendarAndDate: {
		alignItems: "flex-end",
		gap: theme.spacing.xxs
	},
	setRow: {
		paddingVertical: theme.spacing.x3s
	},
	exerciseName: {
		marginTop: theme.spacing.xxs
	},
	contentContainer: {
		paddingLeft: theme.spacing.s,
		marginLeft: theme.spacing.xs,
		borderLeftWidth: 1,
		borderColor: theme.colors.primary
	},
	horizontalLine: {
		width: "100%",
		height: 1,
		backgroundColor: theme.colors.grayDark,
		marginVertical: theme.spacing.x3s
	},
	setFlex: {
		flex: 1
	},
	nameFlex: {
		flex: 8
	},
	repsFlex: {
		flex: 2
	}
})
