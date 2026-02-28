import { DatabaseRoutineDay } from "../../types/routines"
import { parseWeekdayToShortText } from "../../utils/parsing"
import { RoutineDayCodeBox } from "./RoutineDayCodeBox"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import { Weekday } from "../../types/misc"
import StyledText from "../texts/StyledText"

type Props = {
	weekday: Weekday
	routineDay: DatabaseRoutineDay | null
	onPress?: (weekday: Weekday) => void
}
export default function ScheduleDay({ routineDay, weekday, onPress }: Props) {
	return (
		<TouchableOpacity
			onPress={() => onPress?.(weekday)}
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
				<View style={styles.emptyBox}>
					<StyledText type="boldText" color="grayDark">
						-
					</StyledText>
				</View>
			)}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		gap: theme.spacing.xxs
	},
	emptyBox: {
		width: theme.spacing.x3l,
		height: theme.spacing.x3l,
		alignItems: "center",
		justifyContent: "center"
	}
})
