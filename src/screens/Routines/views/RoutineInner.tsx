import { RoutineAndDays } from "../../../types/routines"
import { ScrollView } from "react-native-gesture-handler"
import { StyleSheet } from "react-native"
import { theme } from "../../../resources/theme"
import { useTranslation } from "react-i18next"
import Button from "../../../components/buttons/Button"
import RoutineDayCard from "../../../components/cards/RoutineDayCard"
import StyledText from "../../../components/texts/StyledText"

type Props = {
	routine: RoutineAndDays
}
export default function RoutineInner({ routine: { routine, days } }: Props) {
	const { t } = useTranslation()

	function handleStartWorkout() {}

	function handleAddRoutineDay() {}

	function handleEditDay() {}

	function handleSeeDayHistory() {}

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
		>
			<StyledText type="title" align="center">
				{routine.name}
			</StyledText>

			{days.map((day) => (
				<RoutineDayCard
					routineDay={day}
					onPressEdit={handleEditDay}
					onPressHistory={handleSeeDayHistory}
				/>
			))}
			<RoutineDayCard
				routineDay={null}
				title={t("actions.add-day")}
				color="primary"
				onPressCard={handleAddRoutineDay}
			/>

			<Button
				title={t("actions.start-workout")}
				onPress={handleStartWorkout}
				size="l"
				alignSelf
			/>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		paddingHorizontal: theme.spacing.s
	},
	contentContainer: {
		gap: theme.spacing.l
	}
})
