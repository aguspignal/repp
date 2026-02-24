import { DatabaseRoutineDay, Weekday } from "../../types/routines"
import { parseWeekdayToShortText } from "../../utils/parsing"
import { RoutineDayCodeBox } from "./RoutineDayCodeBox"
import { StyleSheet, TouchableOpacity } from "react-native"
import { theme } from "../../resources/theme"
import StyledText from "../texts/StyledText"

type Props = {
	weekday: Weekday
	routineDay: DatabaseRoutineDay | null
	onPress?: (weekday: Weekday) => void
}
export default function ScheduleDay({ routineDay, weekday, onPress }: Props) {
	function handlePress() {
		if (onPress) onPress(weekday)
	}

	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={onPress === undefined}
			style={styles.container}
		>
			<StyledText type="boldNote">
				{parseWeekdayToShortText(weekday)}
			</StyledText>

			{routineDay ? (
				<RoutineDayCodeBox
					dayId={routineDay.id}
					code={routineDay.code}
					size="s"
					color="primary"
				/>
			) : (
				<StyledText type="boldNote" color="grayDark">
					-
				</StyledText>
			)}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		gap: theme.spacing.xxs,
		flex: 1
		// borderColor: theme.colors.danger,
		// borderWidth: 1
	}
})
