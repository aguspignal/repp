import {
	DatabaseWorkout,
	DatabaseWorkoutSet,
	ExerciseWithProgressionsAndSets,
	WorkoutHistoryViewPer
} from "../../types/workouts"
import { DatabaseProgression } from "../../types/exercises"
import { parseDateToWeekdayMonthDay } from "../../utils/parsing"
import { RootStackNavigationProp } from "../../navigation/params"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import { useMemo, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { useUserStore } from "../../stores/useUserStore"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	workout: DatabaseWorkout
	sets: DatabaseWorkoutSet[]
	isFirstInList?: boolean
	canEdit: boolean
	viewPer?: WorkoutHistoryViewPer
}
export default function RoutineDayHistoryCard({
	workout,
	sets,
	isFirstInList = false,
	canEdit = true,
	viewPer = "progression"
}: Props) {
	const { exercises } = useUserStore()
	const nav = useNavigation<RootStackNavigationProp>()

	const workoutExercisesProgressionsAndSets: ExerciseWithProgressionsAndSets[] =
		useMemo(() => {
			const progressionIds = new Set(sets.map((s) => s.progression_id))

			const relevantExercises = exercises.filter((e) =>
				e.progressions.some((p) => progressionIds.has(p.id))
			)

			return relevantExercises.map((e) => ({
				exercise: e.exercise,
				progressions: e.progressions.filter((p) =>
					progressionIds.has(p.id)
				),
				sets: sets.filter((s) =>
					e.progressions.some((p) => p.id === s.progression_id)
				)
			}))
		}, [sets, exercises])

	const [showContent, setShowContent] = useState(isFirstInList)

	function handleEditWorkout() {
		nav.navigate("EditWorkout", {
			dayId: workout.routineday_id,
			wId: workout.id
		})
	}

	return (
		<View>
			<TouchableOpacity
				onPress={() => setShowContent((prev) => !prev)}
				style={[styles.row, styles.header]}
			>
				<View style={[styles.row, styles.calendarAndDate]}>
					{/* <MCIcon
						name="calendar"
						color={showContent ? "primary" : "textLight"}
						size="xxl"
					/> */}
					<StyledText
						type="subtitle"
						color={showContent ? "primary" : "textLight"}
					>
						{parseDateToWeekdayMonthDay(new Date(workout.date))}
					</StyledText>
				</View>

				{canEdit ? (
					<TouchableOpacity onPress={handleEditWorkout}>
						<MCIcon name="rename" color="grayDark" size="xxl" />
					</TouchableOpacity>
				) : null}
			</TouchableOpacity>

			{showContent ? (
				<View style={styles.contentContainer}>
					{workout.note ? (
						<StyledText
							type="note"
							color="grayDark"
							style={styles.note}
						>
							{workout.note}
						</StyledText>
					) : null}

					{workoutExercisesProgressionsAndSets.map((weps) => (
						<HistoryExercise
							key={weps.exercise.id}
							{...weps}
							viewPer={viewPer}
						/>
					))}
				</View>
			) : null}
		</View>
	)
}

type HistoryExerciseProps = ExerciseWithProgressionsAndSets & {
	viewPer: WorkoutHistoryViewPer
}
function HistoryExercise({
	exercise,
	progressions,
	sets,
	viewPer
}: HistoryExerciseProps) {
	const progressionMap = useMemo(
		() => new Map(progressions.map((p) => [p.id, p])),
		[progressions]
	)

	const filteredProgressions = useMemo(
		() =>
			progressions.filter((p) =>
				sets.some((s) => s.progression_id === p.id)
			),
		[progressions, sets]
	)

	return (
		<View style={styles.historyExerciseContainer}>
			<StyledText type="boldText" style={styles.exerciseName}>
				{exercise.name}
			</StyledText>

			<View style={styles.horizontalLine} />

			<View style={styles.setsContainer}>
				{viewPer === "set"
					? sets.map((set) => (
							<PerSetRow
								key={set.id}
								set={set}
								progressionName={
									progressionMap.get(set.progression_id)
										?.name ?? "-"
								}
							/>
						))
					: filteredProgressions.map((prog) => (
							<PerProgressionRow
								key={prog.id}
								progression={prog}
								sets={sets.filter(
									(set) => set.progression_id === prog.id
								)}
								totalExerciseSets={sets.length}
							/>
						))}
			</View>
		</View>
	)
}

type SetRowProps = {
	progressionName: string
	set: DatabaseWorkoutSet
}
function PerSetRow({ set, progressionName }: SetRowProps) {
	return (
		<View style={[styles.row, styles.setRow]}>
			<StyledText type="boldText" align="center" style={styles.setFlex}>
				{set.order}
			</StyledText>

			<StyledText type="text" style={styles.nameFlex}>
				{progressionName}
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
	)
}

type ProgressionRowProps = {
	progression: DatabaseProgression
	sets: DatabaseWorkoutSet[]
	totalExerciseSets: number
}
function PerProgressionRow({
	progression,
	sets,
	totalExerciseSets
}: ProgressionRowProps) {
	const allSets = useMemo(() => {
		const setsMap = new Map(sets.map((s) => [s.order, s.reps.toString()]))

		return Array.from({ length: totalExerciseSets }, (_, i) => ({
			order: i + 1,
			repsStr: setsMap.get(i + 1) ?? "-"
		}))
	}, [sets, totalExerciseSets])

	return (
		<View style={[styles.row, styles.progRow]}>
			<StyledText type="text" style={styles.perProgNameFlex}>
				{progression.name}
			</StyledText>

			<View style={[styles.row, styles.progRowSetsContainer]}>
				{allSets.map((set) => (
					<StyledText
						key={set.order}
						type="boldText"
						align="center"
						color={set.repsStr === "-" ? "grayDark" : "textLight"}
						style={styles.perProgSetFlex}
					>
						{set.repsStr}
					</StyledText>
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
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
		paddingVertical: theme.spacing.x3s,
		marginLeft: theme.spacing.xxs
	},
	progRow: {
		paddingLeft: theme.spacing.s
	},
	note: {
		marginLeft: theme.spacing.s,
		marginVertical: theme.spacing.x3s
	},
	historyExerciseContainer: {
		paddingTop: theme.spacing.xxs
	},
	exerciseName: {
		// marginVertical: theme.spacing.xxs,
		marginLeft: theme.spacing.s
	},
	contentContainer: {
		marginLeft: theme.spacing.xs,
		borderLeftWidth: 1,
		borderColor: theme.colors.primary,
		gap: theme.spacing.s
	},
	setsContainer: {
		gap: theme.spacing.xxs
	},
	horizontalLine: {
		width: "100%",
		height: 1,
		backgroundColor: theme.colors.primary,
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
	},
	progRowSetsContainer: {
		width: "50%",
		justifyContent: "flex-end",
		gap: theme.spacing.s
		// backgroundColor: theme.colors.grayLight,
	},
	perProgNameFlex: {
		// flex: 1,
		width: "50%"
		// backgroundColor: theme.colors.secondary
	},
	perProgSetFlex: {
		// flex: 1,
		// backgroundColor: theme.colors.danger
	},
	setsRowContainer: {
		gap: theme.spacing.xxs
	}
})
