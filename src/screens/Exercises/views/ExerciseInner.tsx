import {
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	View
} from "react-native"
import {
	DatabaseProgression,
	DraftProgression,
	ExerciseUpdatePayload,
	ExerciseWithProgressions
} from "../../../types/exercises"
import {
	CreateExerciseSchema,
	CreateExerciseValues
} from "../../../utils/zodSchemas"
import { areProgressionsValid } from "../../../utils/validation"
import { sortProgressionsByOrderDesc } from "../../../utils/sorting"
import { theme } from "../../../resources/theme"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../../stores/useUserStore"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../../../components/buttons/Button"
import CreateExerciseInput from "../../../components/inputs/CreateExerciseInput"
import DraftProgressionCard from "../../../components/cards/DraftProgressionCard"
import ExerciseTypeCard from "../../../components/cards/ExerciseTypeCard"
import StyledText from "../../../components/texts/StyledText"
import TextButton from "../../../components/buttons/TextButton"
import ToastNotification from "../../../components/notifications/ToastNotification"
import useKeyboardBehaviour from "../../../hooks/useKeyboardBehaviour"

type Props = {
	type: "create" | "edit"
	exerciseData: ExerciseWithProgressions | null
	onSubmit: (params: ExerciseUpdatePayload) => void
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
	const { behaviour } = useKeyboardBehaviour()

	const {
		handleSubmit,
		control,
		formState: { isLoading, isSubmitting }
	} = useForm<CreateExerciseValues>({
		defaultValues: {
			name: exerciseData?.exercise.name ?? "",
			description: exerciseData?.exercise.description ?? ""
		},
		resolver: zodResolver(CreateExerciseSchema)
	})

	const emptyProgression = (order: number): DatabaseProgression => ({
		name: "",
		order,
		is_weighted: false,
		weight: null,
		id: -1,
		exercise_id: -1,
		created_at: ""
	})

	const [progressions, setProgressions] = useState<DatabaseProgression[]>(
		exerciseData && exerciseData.progressions.length > 0
			? sortProgressionsByOrderDesc(exerciseData.progressions)
			: [emptyProgression(1)]
	)
	const [isBodyweight, setIsBodyweight] = useState(
		exerciseData?.exercise.is_bodyweight ?? false
	)
	const [isFreeweight, setIsFreeweight] = useState(
		exerciseData?.exercise.is_freeweight ?? false
	)
	const [isIsometric, setIsIsometric] = useState(
		exerciseData?.exercise.is_isometric ?? false
	)

	function handleAddProgression() {
		const sorted = sortProgressionsByOrderDesc(progressions)
		const nextOrder = (sorted[0]?.order ?? 0) + 1

		setProgressions((prev) => [emptyProgression(nextOrder), ...prev])
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

	function mapProgressionChanges() {
		const diff =
			progressions.length - (exerciseData?.progressions.length ?? 0)

		const toCompare =
			exerciseData?.progressions.length === 0
				? []
				: diff > 0
					? progressions.slice(diff)
					: progressions

		const upsertProgressions: DatabaseProgression[] = toCompare.filter(
			(newProg, i) => {
				const oldIndex = diff >= 0 ? i : i - diff
				const oldProg = exerciseData?.progressions[oldIndex]
				return oldProg?.name !== newProg?.name
			}
		)

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

		return {
			upsertProgressions,
			insertProgressions,
			deleteProgressionsFromOrder
		}
	}

	async function handleAction({ description, name }: CreateExerciseValues) {
		if (!user || (type === "edit" && !exerciseData)) return

		if (!isBodyweight && !isFreeweight) {
			ToastNotification({
				title: t("error-messages.please-select-type-for-exercise")
			})
			return
		}

		if (!areProgressionsValid(progressions)) {
			ToastNotification({
				title: t("error-messages.you-cant-add-empty-progressions")
			})
			return
		}

		const {
			deleteProgressionsFromOrder,
			insertProgressions,
			upsertProgressions
		} = mapProgressionChanges()

		console.log(upsertProgressions)
		console.log(insertProgressions)
		console.log(deleteProgressionsFromOrder)

		onSubmit({
			draftExercise: {
				name,
				description: description ?? null,
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
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={behaviour}>
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
			>
				<View>
					<CreateExerciseInput name="name" control={control} />
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
							textType="boldText"
						/>
					</View>

					{progressions.map((prog) => (
						<DraftProgressionCard
							progression={prog}
							onUpdate={handleUpdateProgression}
							onDelete={
								progressions.length > 1 &&
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
