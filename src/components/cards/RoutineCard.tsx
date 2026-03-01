import { divideRoutineDayInGroups } from "../../utils/parsing"
import { RootStackNavigationProp } from "../../navigation/params"
import { RoutineDayCodeBox } from "./RoutineDayCodeBox"
import { RoutineWithDays } from "../../types/routines"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import { useNavigation } from "@react-navigation/native"
import StyledText from "../texts/StyledText"

type Props = {
	routine: RoutineWithDays
}

export default function RoutineCard({ routine: { routine, days } }: Props) {
	const nav = useNavigation<RootStackNavigationProp>()

	function handlePressCard() {
		nav.navigate("Tabs", {
			screen: "RoutinesTab",
			params: {
				screen: "Routine",
				params: { id: routine.id }
			}
		})
	}

	return (
		<TouchableOpacity style={styles.container} onPress={handlePressCard}>
			<StyledText type="boldText">{routine.name}</StyledText>

			<View style={styles.daysContainer}>
				{divideRoutineDayInGroups(days).map((group) => (
					<View style={styles.daysGroup} key={group[0].id}>
						{group.map((day) => (
							<RoutineDayCodeBox
								dayId={day.id}
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
		gap: theme.spacing.x3s,
		alignItems: "center"
	},
	daysGroup: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.x3s
	}
})
