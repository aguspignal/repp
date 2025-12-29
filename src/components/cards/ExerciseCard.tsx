import { DatabaseExercise } from "../../types/exercises"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	exercise: DatabaseExercise
	onPress: (exerciseId: number) => void
}
export default function ExerciseCard({ exercise, onPress }: Props) {
	function handlePressCard() {
		onPress(exercise.id)
	}

	return (
		<TouchableOpacity onPress={handlePressCard} style={styles.container}>
			<View style={styles.nameAndIcons}>
				<StyledText type="boldText">{exercise?.name}</StyledText>
				{exercise.is_bodyweight ? <MCIcon name="gymnastics" /> : null}
				{exercise.is_freeweight ? <MCIcon name="dumbbell" /> : null}
				{exercise.is_isometric ? <MCIcon name="timer-outline" /> : null}
			</View>

			<MCIcon name="chevron-right" color="grayDark" />
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.s,
		paddingVertical: theme.spacing.xs,
		backgroundColor: theme.colors.backgroundGray,
		borderRadius: theme.spacing.xxs
	},
	nameAndIcons: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xxs
	}
})
