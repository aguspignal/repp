import { divideRoutineDayInGroups } from "../../utils/parsing"
import { RootStackNavigationProp } from "../../navigation/params"
import { RoutineAndDays } from "../../types/routines"
import { RoutineDayCodeBox } from "./RoutineDayCard"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import { useNavigation } from "@react-navigation/native"
import StyledText from "../texts/StyledText"

type Props = {
	routine: RoutineAndDays
}

export default function RoutineCard({ routine: { routine, days } }: Props) {
	const nav = useNavigation<RootStackNavigationProp>()

	function handlePressCard() {
		nav.navigate("Routine", { id: routine.id })
	}

	return (
		<TouchableOpacity style={styles.container} onPress={handlePressCard}>
			<StyledText type="subtitle">{routine.name}</StyledText>

			<View style={styles.daysContainer}>
				{divideRoutineDayInGroups(days, 3).map((group) => (
					<View style={styles.daysGroup}>
						{group.map((day) => (
							<RoutineDayCodeBox
								code={day.code}
								color="textLight"
								size="m"
							/>
						))}
					</View>
				))}
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {},
	daysContainer: {},
	daysGroup: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xxs
	}
})
