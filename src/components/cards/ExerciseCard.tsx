import { DatabaseExercise } from "../../types/exercises"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import { useState } from "react"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	exercise: DatabaseExercise
	onPress: (exercise: DatabaseExercise, isSelected: boolean) => void
	isSelectable?: boolean
}
export default function ExerciseCard({
	exercise,
	onPress,
	isSelectable = false
}: Props) {
	const [isSelected, setIsSelected] = useState(false)

	function handlePressCard() {
		onPress(exercise, !isSelected)
		setIsSelected((prev) => !prev)
	}

	return (
		<TouchableOpacity
			onPress={handlePressCard}
			style={[
				styles.container,
				isSelectable
					? styles.selectableContainer
					: styles.filledContainer
			]}
		>
			<View style={styles.nameAndIcons}>
				<StyledText type="boldText">{exercise?.name}</StyledText>
				{exercise.is_bodyweight ? <MCIcon name="gymnastics" /> : null}
				{exercise.is_freeweight ? <MCIcon name="dumbbell" /> : null}
				{exercise.is_isometric ? <MCIcon name="timer-outline" /> : null}
			</View>

			<View
				style={[
					isSelectable ? styles.checkbox : null,
					isSelectable && isSelected ? styles.selectedCheckbox : null
				]}
			>
				{isSelectable ? null : (
					<MCIcon name="chevron-right" color="grayDark" />
				)}
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: theme.spacing.xs,
		gap: theme.spacing.xxs
	},
	filledContainer: {
		backgroundColor: theme.colors.backgroundGray,
		paddingHorizontal: theme.spacing.s,
		borderRadius: theme.spacing.xxs
	},
	selectableContainer: {},
	nameAndIcons: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xxs
	},
	checkbox: {
		borderWidth: 1,
		borderColor: theme.colors.gray,
		borderRadius: 2,
		padding: theme.spacing.xxs
	},
	selectedCheckbox: {
		borderWidth: 0,
		backgroundColor: theme.colors.primary,
		padding: theme.spacing.xxs + 1
	}
})
