import {
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise
} from "../../types/routines"
import { parseGoalsToText } from "../../utils/parsing"
import { RoutineDayCodeBox } from "./RoutineDayCodeBox"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import { useUserStore } from "../../stores/useUserStore"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	routineDay: DatabaseRoutineDay | null
	rdExercises?: DatabaseRoutineDayExercise[]
	color?: keyof typeof theme.colors
	title?: string
	onPressCard?: (rd: DatabaseRoutineDay | null) => void
	onPressHistory?: (dayId: number) => void
}

export default function RoutineDayCard({
	routineDay,
	rdExercises,
	color = "textLight",
	title,
	onPressCard,
	onPressHistory
}: Props) {
	const { exercises } = useUserStore()

	function handlePressCard() {
		if (onPressCard) onPressCard(routineDay)
	}

	function handleHistory() {
		if (onPressHistory && routineDay) onPressHistory(routineDay.id)
	}

	return (
		<TouchableOpacity
			onPress={handlePressCard}
			activeOpacity={onPressCard ? 0.7 : 1}
		>
			<View style={styles.header}>
				<View style={styles.codeAndTitle}>
					<RoutineDayCodeBox
						dayId={routineDay?.id}
						code={routineDay?.code}
						color={color}
						plusIcon={!routineDay}
						size="m"
						onPress={() => {}}
					/>

					<StyledText type="subtitle" color={color}>
						{routineDay ? routineDay.name : title}
					</StyledText>
				</View>

				<View style={styles.actionContainer}>
					{onPressHistory ? (
						<TouchableOpacity onPress={handleHistory}>
							<MCIcon name="history" size="h3" />
						</TouchableOpacity>
					) : null}
				</View>
			</View>

			{rdExercises && rdExercises.length > 0 ? (
				<View style={styles.exercisesContainer}>
					<View style={styles.exercisesList}>
						{rdExercises.map(
							({
								id,
								exercise_id,
								rep_goal_low,
								rep_goal_high,
								set_goal_low,
								set_goal_high
							}) => (
								<View key={id} style={styles.header}>
									<StyledText type="text" color="grayDark">
										{
											exercises.find(
												(e) =>
													e.exercise.id ===
													exercise_id
											)?.exercise.name
										}
									</StyledText>

									<StyledText type="text" color="secondary">
										{parseGoalsToText(
											{
												rep_goal_high,
												rep_goal_low,
												set_goal_high,
												set_goal_low
											},
											false,
											true
										)}
									</StyledText>
								</View>
							)
						)}
					</View>
				</View>
			) : null}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	codeAndTitle: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.s
	},
	actionContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xs
	},
	exercisesContainer: {
		paddingLeft: 28
	},
	exercisesList: {
		paddingLeft: theme.spacing.xs,
		paddingTop: theme.spacing.xxs,
		paddingBottom: theme.spacing.x3s,
		borderLeftWidth: 1,
		borderLeftColor: theme.colors.grayDark,
		gap: theme.spacing.xxs
	}
})
