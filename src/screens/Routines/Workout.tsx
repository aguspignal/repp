import { StyleSheet, View } from "react-native"
import { theme } from "../../resources/theme"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { WorkoutSchema, WorkoutValues } from "../../utils/valdiationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../../components/buttons/Button"
import StyledText from "../../components/texts/StyledText"

export default function Workout() {
	const { t } = useTranslation()

	const { handleSubmit, control } = useForm<WorkoutValues>({
		resolver: zodResolver(WorkoutSchema)
	})

	function handleFinishWorkout() {}

	return (
		<View style={styles.container}>
			<Button
				title={t("actions.finish-workout")}
				onPress={handleSubmit(handleFinishWorkout)}
			/>

			<View></View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		paddingHorizontal: theme.spacing.s
	}
})
