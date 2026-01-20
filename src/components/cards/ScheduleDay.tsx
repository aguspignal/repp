import { DatabaseRoutineDay, Weekday } from "../../types/routines"
import { RoutineDayCodeBox } from "./RoutineDayCodeBox"
import { StyleSheet, View } from "react-native"
import { theme } from "../../resources/theme"
import StyledText from "../texts/StyledText"

type Props = {
	weekday: Weekday
	routineDay: DatabaseRoutineDay | null
}
export default function ScheduleDay({ routineDay, weekday }: Props) {
	return (
		<View style={styles.container}>
			<StyledText type="boldNote">{weekday.slice(0, 3)}</StyledText>

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
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		gap: theme.spacing.xxs
	}
})
