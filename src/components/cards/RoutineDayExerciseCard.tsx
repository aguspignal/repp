import { DraftRoutineDayExercise, RDEGoalType } from "../../types/routines"
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import MCIcon from "../icons/MCIcon"
import RDEGoalRangeInput from "../inputs/RDEGoalRangeInput"
import Sortables from "react-native-sortables"
import StyledText from "../texts/StyledText"

type Props = {
	draftRDExercise: DraftRoutineDayExercise
	index: number
	onDelete: (e: DraftRoutineDayExercise) => void
	onUpdateNote: (draftRDE: DraftRoutineDayExercise, note: string) => void
	onUpdateGoal: (
		draftRDE: DraftRoutineDayExercise,
		goal: number | null,
		goalType: RDEGoalType
	) => void
}
export default function RoutineDayExerciseCard({
	draftRDExercise,
	index,
	onDelete,
	onUpdateNote,
	onUpdateGoal
}: Props) {
	const { t } = useTranslation()
	const { exercises } = useUserStore()

	const exercise = useMemo(
		() => exercises.find((e) => e.id === draftRDExercise.exercise_id),
		[exercises, draftRDExercise.exercise_id]
	)

	const [note, setNote] = useState<string>(draftRDExercise.note ?? "")

	const [setsGoalHigh, setSetsGoalHigh] = useState<string>(
		draftRDExercise.set_goal_high?.toString() ?? ""
	)
	const [setsGoalLow, setSetsGoalLow] = useState<string>(
		draftRDExercise.set_goal_low?.toString() ?? ""
	)

	const [repsGoalHigh, setRepsGoalHigh] = useState<string>(
		draftRDExercise.rep_goal_high?.toString() ?? ""
	)
	const [repsGoalLow, setRepsGoalLow] = useState<string>(
		draftRDExercise.rep_goal_low?.toString() ?? ""
	)

	const [showSetsRange, setShowSetsRange] = useState(
		draftRDExercise.set_goal_high !== null
	)
	const [showRepsRange, setShowRepsRange] = useState(
		draftRDExercise.rep_goal_high !== null
	)

	function handleChangeNote(txt: string) {
		setNote(txt)
		onUpdateNote(draftRDExercise, txt)
	}

	function handleChangeGoal(goal: number | null, goalType: RDEGoalType) {
		const value: string = goal ? goal.toString() : ""

		switch (goalType) {
			case "setsLow": {
				setSetsGoalLow(value)
				break
			}
			case "setsHigh": {
				setSetsGoalHigh(value)
				break
			}
			case "repsLow": {
				setRepsGoalLow(value)
				break
			}
			case "repsHigh": {
				setRepsGoalHigh(value)
				break
			}
		}

		onUpdateGoal(draftRDExercise, goal, goalType)
	}

	return (
		<View style={[styles.container, styles.row]}>
			<View style={{ flex: 1 }}>
				<View style={[styles.row, styles.spaceBetween]}>
					<Sortables.Handle style={[styles.row, { flex: 1 }]}>
						<StyledText type="subtitle">{index + 1}</StyledText>
						<StyledText type="subtitle">
							{exercise?.name}
						</StyledText>
					</Sortables.Handle>

					<TouchableOpacity onPress={() => onDelete(draftRDExercise)}>
						<MCIcon name="trash-can" />
					</TouchableOpacity>
				</View>

				<View style={styles.row}>
					<TextInput
						value={note}
						onChangeText={(txt) => handleChangeNote(txt)}
						placeholder={t(
							"actions.add-notes-for-this-exercise-here"
						)}
						multiline
						style={styles.input}
					/>
				</View>

				<RDEGoalRangeInput
					type="sets"
					goalHigh={setsGoalHigh}
					goalLow={setsGoalLow}
					showRange={showSetsRange}
					setGoalLow={setSetsGoalLow}
					setGoalHigh={setSetsGoalHigh}
					setShowRange={setShowSetsRange}
					onUpdateGoal={handleChangeGoal}
				/>

				<RDEGoalRangeInput
					type="reps"
					goalHigh={repsGoalHigh}
					goalLow={repsGoalLow}
					showRange={showRepsRange}
					setGoalLow={setRepsGoalLow}
					setGoalHigh={setRepsGoalHigh}
					setShowRange={setShowRepsRange}
					onUpdateGoal={handleChangeGoal}
					inSeconds={exercise?.is_isometric}
				/>
			</View>

			{/* <Sortables.Handle>
				<MCIcon name="drag-vertical" />
			</Sortables.Handle> */}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: theme.spacing.xxs
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xs
	},
	spaceBetween: {
		justifyContent: "space-between"
	},
	input: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.s,
		paddingTop: theme.spacing.s,
		paddingLeft: 0,
		width: "100%"
		// backgroundColor: "#ff0000"
	}
})
