import {
	DatabaseWorkoutSet,
	WorkoutSetsAndProgressions
} from "../../types/routines"
import { DatabaseProgression } from "../../types/exercises"
import { parseDateToWeekdayMonthDay } from "../../utils/parsing"
import { StyleSheet, View } from "react-native"
import { theme } from "../../resources/theme"
import { useState } from "react"
import { useUserStore } from "../../stores/useUserStore"
import IconButton from "../buttons/IconButton"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	workoutSetsProgressions: WorkoutSetsAndProgressions
}
export default function RoutineDayHistoryCard({
	workoutSetsProgressions: { workout, progressions, sets}
}: Props) {
	const [showContent, setShowContent] = useState(false)

	return (
		<View style={styles.container}>
			<View style={[styles.row, styles.header]}>
				<View style={styles.row}>
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

				<IconButton
					onPress={() => setShowContent((prev) => !prev)}
					icon={showContent ? "chevron-up" : "chevron-down"}
					color="grayDark"
				/>
			</View>

			{showContent ? (
				<View style={styles.contentContainer}>
					{workout.note ? (
						<StyledText type="note">{workout.note}</StyledText>
					) : null}
				</View>

                {setsAndProgressions.map(sp => <HistoryExerciseSets  />)}
			) : null}
		</View>
	)
}

type HistoryExerciseSetsProps = {
	sets: DatabaseWorkoutSet[]
	progressions: DatabaseProgression[]
}
function HistoryExerciseSets({ progressions, sets }: HistoryExerciseSetsProps) {
	const { exercises } = useUserStore()

	return (
		<View>
			<StyledText type="boldText">
				{
					exercises.find(
						(e) =>
							e.id ===
							progressions.find(
								(p) => p.id === set.progression_id
							)?.exercise_id
					)?.name
				}
			</StyledText>

			<View style={styles.horizontalLine} />

			<View style={[styles.row, styles.header]}>
				<View style={styles.row}>
					<StyledText type="text">{set.order}</StyledText>

					<StyledText type="boldText">
						{progressions.find((p) => p.id === set.progression_id)
							?.name ?? "-"}
					</StyledText>
				</View>

				<StyledText type="boldText">{set.reps}</StyledText>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xxs
	},
	header: {
		justifyContent: "space-between"
	},
	contentContainer: {
		paddingLeft: theme.spacing.s,
		marginLeft: theme.spacing.s,
		borderLeftWidth: 1,
		borderColor: theme.colors.primary
	},
	horizontalLine: {
		width: "100%",
		height: 1,
		backgroundColor: theme.colors.grayDark,
		marginVertical: theme.spacing.xxs
	}
})
