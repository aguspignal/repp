import {
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise
} from "../../../types/routines"
import { EditRoutineDayValidationSchema } from "../../../utils/valdiationSchemas"
import { EditRoutineDayValues } from "../../../types/forms"
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../../resources/theme"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { yupResolver } from "@hookform/resolvers/yup"
import Button from "../../../components/buttons/Button"
import EditRoutineDayInput from "../../../components/inputs/EditRoutineDayInput"
import MCIcon from "../../../components/icons/MCIcon"
import StyledText from "../../../components/texts/StyledText"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../navigation/params"

type Props = {
	day: DatabaseRoutineDay
	exercises: DatabaseRoutineDayExercise[]
}
export default function EditRoutineDayInner({ day, exercises }: Props) {
	const { t } = useTranslation()
	const nav = useNavigation<RootStackNavigationProp>()

	const {
		handleSubmit,
		control,
		formState: { isLoading, isSubmitting }
	} = useForm<EditRoutineDayValues>({
		defaultValues: {
			code: day.code ?? "",
			name: day.name ?? ""
		},
		resolver: yupResolver(EditRoutineDayValidationSchema)
	})

	function handleSaveChanges({ code, name }: EditRoutineDayValues) {}

	function handleAddExercise() {
		nav.navigate("ExerciseRepository", { selectionView: true })
	}

	return (
		<View style={styles.container}>
			<View>
				<View style={styles.codeAndName}>
					<EditRoutineDayInput name="code" control={control} />
					<EditRoutineDayInput name="name" control={control} />
				</View>

				<View style={styles.exercisesContainer}>
					<StyledText type="subtitle">
						{t("titles.exercises")}
					</StyledText>

					<FlatList
						data={exercises}
						renderItem={({ item: e }) => (
							<View key={e.id}>
								<StyledText type="text">
									{e.order + " - " + e.exercise_id}
								</StyledText>
							</View>
						)}
					/>

					<TouchableOpacity
						onPress={handleAddExercise}
						style={styles.addExerciseBtn}
					>
						<MCIcon name="plus" color="primary" size="xxl" />

						<StyledText type="boldText" color="primary">
							{t("actions.add-exercise-from-repository")}
						</StyledText>
					</TouchableOpacity>
				</View>
			</View>

			<Button
				title={t("actions.save-changes")}
				onPress={handleSubmit(handleSaveChanges)}
				isLoading={isLoading || isSubmitting}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		paddingHorizontal: theme.spacing.s,
		paddingBottom: theme.spacing.x4l,
		justifyContent: "space-between"
	},
	codeAndName: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xs,

		marginBottom: theme.spacing.xl
	},
	exercisesContainer: {
		gap: theme.spacing.s
	},
	addExerciseBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xxs
	}
})
