import { RootStackScreenProps } from "../navigation/params"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../resources/theme"
import { useTranslation } from "react-i18next"
import Button from "../components/buttons/Button"
import MCIcon from "../components/icons/MCIcon"
import StyledText from "../components/texts/StyledText"
import ExerciseCard from "../components/cards/ExerciseCard"

export default function Home({ navigation }: RootStackScreenProps<"Home">) {
	const { t } = useTranslation()

	function handleCreateRoutine() {}

	function goToExerciseRepository() {
		navigation.navigate("ExerciseRepository")
	}

	return (
		<View style={styles.container}>
			<View style={styles.noRoutinesContainer}>
				<MCIcon name="dumbbell" size={"h1"} color="grayDark" />
				<StyledText type="subtitle">
					{t("messages.you-dont-have-routines-yet")}
				</StyledText>
				<StyledText type="boldNote">
					{t("messages.create-routine-to-start-workingout")}
				</StyledText>
			</View>

			<Button
				title="Create new routine"
				onPress={handleCreateRoutine}
				size="l"
				alignSelf
			/>

			<TouchableOpacity
				onPress={goToExerciseRepository}
				style={styles.exerciseRepoCard}
			>
				<StyledText type="boldText">
					{t("titles.exercise-repository")}
				</StyledText>

				<MCIcon name="chevron-right" color="grayDark" />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		gap: theme.spacing.xl,
		paddingHorizontal: theme.spacing.s
	},
	noRoutinesContainer: {
		alignItems: "center",
		gap: theme.spacing.s
	},
	exerciseRepoCard: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.s,
		paddingVertical: theme.spacing.xs,
		backgroundColor: theme.colors.backgroundGray,
		borderRadius: theme.spacing.xxs
	}
})
