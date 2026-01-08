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
				{divideRoutineDayInGroups(days).map((group) => (
					<View style={styles.daysGroup} key={group[0].id}>
						{group.map((day) => (
							<RoutineDayCodeBox
								code={day.code}
								color="textLight"
								size="m"
								key={day.id}
							/>
						))}
					</View>
				))}
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		gap: theme.spacing.xxs
	},
	daysContainer: {
		gap: 4,
		alignItems: "center"
	},
	daysGroup: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4
	}
})
