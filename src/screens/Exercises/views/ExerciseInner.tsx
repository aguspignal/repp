import {
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	View
} from "react-native"
import {
	DatabaseProgression,
	DraftExerciseAndProgression,
	DraftProgression,
	ExerciseAndProgressions
} from "../../../types/exercises"
import { CreateExerciseValidationSchema } from "../../../utils/valdiationSchemas"
import { CreateExerciseValues } from "../../../types/forms"
import { sortProgressionsByOrderDesc } from "../../../utils/parsing"
import { theme } from "../../../resources/theme"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../../stores/useUserStore"
import { yupResolver } from "@hookform/resolvers/yup"
import Button from "../../../components/buttons/Button"
import CreateExerciseInput from "../../../components/inputs/CreateExerciseInput"
import DraftProgressionCard from "../../../components/cards/DraftProgressionCard"
import ExerciseTypeCard from "../../../components/cards/ExerciseTypeCard"
import StyledText from "../../../components/texts/StyledText"
import TextButton from "../../../components/buttons/TextButton"
import ToastNotification from "../../../components/notifications/ToastNotification"

type Props = {
	type: "create" | "edit"
	exerciseData: ExerciseAndProgressions | null
	onSubmit: (params: DraftExerciseAndProgression) => void
	isPendingAction: boolean
}

export default function ExerciseInner({
	type,
	exerciseData,
	onSubmit,
	isPendingAction
}: Props) {
	const { t } = useTranslation()
	const { user } = useUserStore()

	const {
		handleSubmit,
		control,
		getValues,
		formState: { isLoading, isSubmitting }
	} = useForm<CreateExerciseValues>({
		defaultValues: {
			name: exerciseData?.exercise.name ?? "",
			description: exerciseData?.exercise.description ?? ""
		},
		// @ts-ignore
		resolver: yupResolver(CreateExerciseValidationSchema)
	})

	const [isBodyweight, setIsBodyweight] = useState(
		exerciseData?.exercise.is_bodyweight ?? false
	)
	const [isFreeweight, setIsFreeweight] = useState(
		exerciseData?.exercise.is_freeweight ?? false
	)
	const [isIsometric, setIsIsometric] = useState(
		exerciseData?.exercise.is_isometric ?? false
	)

	const [progressions, setProgressions] = useState<DatabaseProgression[]>(
		exerciseData && exerciseData.progressions.length > 0
			? sortProgressionsByOrderDesc(exerciseData.progressions)
			: [
					{
						name: "",
						order: 1,
						is_weighted: false,
						weight: null,
						id: -1,
						exercise_id: -1,
						created_at: ""
					}
			  ]
	)

	function handleAddProgression() {
		const sorted = sortProgressionsByOrderDesc(progressions)

		const nextOrder = (sorted[0]?.order ?? 0) + 1

		const emptyProgression: DatabaseProgression = {
			name: "",
			order: nextOrder,
			is_weighted: false,
			weight: null,
			id: -1,
			exercise_id: -1,
			created_at: ""
		}

		setProgressions((prev) => [emptyProgression, ...prev])
	}

	function handleUpdateProgression(txt: string, progOrder: number) {
		setProgressions((prev) =>
			prev.map((p) => (p.order === progOrder ? { ...p, name: txt } : p))
		)
	}

	function onDeleteProgression(progOrder: number) {
		const filtered = progressions.filter((p) => p.order !== progOrder)

		if (progOrder === progressions.length) {
			setProgressions(filtered)
			return
		}

		const reordered = filtered.map((p) =>
			p.order - 1 >= progOrder ? { ...p, order: p.order - 1 } : p
		)

		setProgressions(reordered)
	}

	async function handleAction() {
		if (!user) return
		if (type === "edit" && !exerciseData) return

		if (!isBodyweight && !isFreeweight) {
			ToastNotification({
				title: t("error-messages.please-select-type-for-exercise")
			})
			return
		}

		const diff =
			progressions.length - (exerciseData?.progressions.length ?? 0)
		const toCompare =
			exerciseData?.progressions.length === 0
				? []
				: diff > 0
				? progressions.slice(diff)
				: progressions

		let upsertProgressions: DatabaseProgression[] = []
		for (let i = 0; i < toCompare.length; i++) {
			const oldProgInOrder =
				diff >= 0
					? exerciseData?.progressions[i]
					: exerciseData?.progressions[i - diff]
			const newProgInOrder = toCompare[i]
			if (oldProgInOrder?.name !== newProgInOrder?.name) {
				upsertProgressions.push(newProgInOrder)
			}
		}

		const insertProgressions: DraftProgression[] =
			diff > 0
				? progressions.slice(0, diff).map((p) => ({
						name: p.name,
						order: p.order,
						is_weighted: p.is_weighted,
						weight: p.weight
				  }))
				: []

		const deleteProgressionsFromOrder =
			diff < 0 ? progressions.length + 1 : null

		onSubmit({
			draftExercise: {
				name: getValues().name,
				description: getValues().description,
				is_bodyweight: isBodyweight,
				is_freeweight: isFreeweight,
				is_isometric: isIsometric
			},
			deleteProgressionsFromOrder,
			insertProgressions,
			upsertProgressions
		})
	}

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
			>
				<View>
					{/* @ts-ignore */}
					<CreateExerciseInput name="name" control={control} />
					{/* @ts-ignore */}
					<CreateExerciseInput name="description" control={control} />
				</View>

				<View style={styles.exerciseCategoriesContainer}>
					<View style={styles.titleAndCardsContainer}>
						<StyledText type="boldText">
							{t("attributes.type")}
						</StyledText>

						<View style={styles.exerciseTypeCardsContainer}>
							<ExerciseTypeCard
								name="bodyweight"
								isSelected={isBodyweight}
								onSelect={setIsBodyweight}
								isDisabled={isFreeweight}
							/>
							<ExerciseTypeCard
								name="freeweight"
								isSelected={isFreeweight}
								onSelect={setIsFreeweight}
								isDisabled={isBodyweight}
							/>
						</View>
					</View>

					<View style={styles.titleAndCardsContainer}>
						<StyledText type="boldText">
							{t("attributes.properties")}
						</StyledText>

						<ExerciseTypeCard
							name="isometric"
							isSelected={isIsometric}
							onSelect={setIsIsometric}
						/>
					</View>
				</View>

				<View style={styles.progressionsContainer}>
					<View style={styles.progressionsTitleContainer}>
						<StyledText type="subtitle">
							{t("titles.progressions")}
						</StyledText>

						<TextButton
							title={t("actions.add")}
							onPress={handleAddProgression}
							icon="plus"
							color="primary"
							textType="subtitle"
						/>
					</View>

					{progressions.map((prog) => (
						<DraftProgressionCard
							progression={prog}
							onUpdate={handleUpdateProgression}
							onDelete={
								prog.order === progressions.length
									? onDeleteProgression
									: undefined
							}
							key={prog.order}
						/>
					))}
				</View>

				<Button
					title={
						type === "create"
							? t("actions.create-exercise")
							: t("actions.save-changes")
					}
					onPress={handleSubmit(handleAction)}
					isLoading={isLoading || isSubmitting || isPendingAction}
				/>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		paddingHorizontal: theme.spacing.s
	},
	contentContainer: {
		gap: theme.spacing.xl,
		paddingBottom: theme.spacing.xl
	},
	exerciseCategoriesContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		// marginVertical: theme.spacing.xl,
		paddingHorizontal: theme.spacing.s
	},
	titleAndCardsContainer: {
		alignItems: "center",
		gap: theme.spacing.xxs
	},
	exerciseTypeCardsContainer: {
		flexDirection: "row",
		gap: theme.spacing.s
	},
	progressionsContainer: {
		gap: theme.spacing.xs
	},
	progressionsTitleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	}
})
