import { Dispatch, SetStateAction } from "react"
import { parseNumericInput } from "../../utils/parsing"
import { RoutineDayExerciseGoalType } from "../../types/routines"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { theme } from "../../resources/theme"
import { useTranslation } from "react-i18next"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	type: "sets" | "reps"
	goalLow: string
	goalHigh: string
	showRange: boolean
	setGoalLow: Dispatch<SetStateAction<string>>
	setGoalHigh: Dispatch<SetStateAction<string>>
	setShowRange: Dispatch<SetStateAction<boolean>>
	onUpdateGoal: (
		goal: number | null,
		goalType: RoutineDayExerciseGoalType
	) => void
	inSeconds?: boolean
}
export default function RDEGoalRangeInput({
	type,
	goalLow,
	goalHigh,
	showRange,
	setGoalLow,
	setGoalHigh,
	setShowRange,
	onUpdateGoal,
	inSeconds = false
}: Props) {
	const { t } = useTranslation()

	function handleChangeGoal(
		txt: string,
		setState: Dispatch<SetStateAction<string>>,
		goalType: RoutineDayExerciseGoalType
	) {
		const num = parseNumericInput(txt, setState)
		onUpdateGoal(num, goalType)
	}

	function toggleRange() {
		if (showRange) {
			setGoalHigh("")
			if (!goalLow && goalHigh) setGoalLow(goalHigh)
		}
		setShowRange((prev) => !prev)
	}

	return (
		<View style={[styles.row, styles.spaceBetween]}>
			<View style={styles.row}>
				<StyledText type="text">
					{type === "sets"
						? t("messages.sets-goal")
						: inSeconds
							? t("messages.seconds-goal")
							: t("messages.reps-goal")}
				</StyledText>

				<TextInput
					value={goalLow}
					onChangeText={(txt) =>
						handleChangeGoal(
							txt,
							setGoalLow,
							type === "sets" ? "setsLow" : "repsLow"
						)
					}
					placeholder="-"
					maxLength={3}
					keyboardType="numeric"
					style={styles.input}
				/>

				{showRange ? (
					<StyledText type="text">{t("messages.to")}</StyledText>
				) : null}

				{showRange ? (
					<TextInput
						value={goalHigh}
						onChangeText={(txt) =>
							handleChangeGoal(
								txt,
								setGoalHigh,
								type === "sets" ? "setsHigh" : "repsHigh"
							)
						}
						placeholder="-"
						maxLength={3}
						keyboardType="numeric"
						style={styles.input}
					/>
				) : null}
			</View>

			<TouchableOpacity onPress={toggleRange}>
				<MCIcon name="swap-horizontal-bold" />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
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
		backgroundColor: theme.colors.backgroundGray,
		paddingHorizontal: theme.spacing.xs,
		borderRadius: theme.spacing.xxs
	}
})
