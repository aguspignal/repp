import { DatabaseExercise, DatabaseProgression } from "../../types/exercises"
import { Dispatch, SetStateAction, useState } from "react"
import { DraftWorkoutSet, ExercisesSets } from "../../types/routines"
import { SheetManager } from "react-native-actions-sheet"
import {
	sortDraftWorkoutSetsByOrderAsc,
	sortProgressionsByOrderDesc
} from "../../utils/sorting"
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import { useTranslation } from "react-i18next"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../navigation/params"
import { SheetOption } from "../../lib/sheets"

type Props = {
	exercise: DatabaseExercise | undefined
	progressions: DatabaseProgression[]
	exercisesSets: ExercisesSets[]
	setExercisesSets: Dispatch<SetStateAction<ExercisesSets[]>>
	onCreateProgression: (eId: number) => void
}

export default function WorkoutExerciseCard({
	exercise,
	progressions,
	exercisesSets,
	setExercisesSets,
	onCreateProgression
}: Props) {
	const { t } = useTranslation()
	const nav = useNavigation<RootStackNavigationProp>()

	const [showDescription, setShowDescription] = useState(true)

	function handleDeleteSet(set: DraftWorkoutSet) {
		if (!exercise) return

		setExercisesSets((prev) =>
			prev.map((es) => {
				if (es.exerciseId !== exercise.id) return es

				const filteredSets = es.sets.filter(
					(s) => s.order !== set.order
				)
				const reorderedSets = filteredSets.map((s, index) => ({
					...s,
					order: index + 1
				}))

				return { ...es, sets: reorderedSets }
			})
		)
	}

	function handleChooseProgression(set: DraftWorkoutSet) {
		const sheetOptions: SheetOption[] = [
			...sortProgressionsByOrderDesc(progressions).map((p) => ({
				label: p.name,
				onPress: () => handleAddProgression(set, p.id)
			})),
			{
				label: t("actions.add-progression"),
				onPress: handleCreateProgression,
				textColor: "primary"
			}
		]

		SheetManager.show("progressions-list", {
			payload: {
				options:
					sheetOptions.length > 1
						? sheetOptions
						: [
								{
									label: t(
										"messages.this-exercise-doesnt-have-any-progressions"
									),
									onPress: () => {},
									textColor: "grayDark"
								},
								...sheetOptions
						  ]
			}
		})
	}

	function handleAddProgression(set: DraftWorkoutSet, progId: number) {
		if (!exercise) return

		setExercisesSets((prev) =>
			prev.map((es) => {
				if (es.exerciseId !== exercise.id) return es

				return {
					...es,
					sets: es.sets.map((s) =>
						s.order === set.order
							? { ...s, progressionId: progId }
							: s
					)
				}
			})
		)

		SheetManager.hide("progressions-list")
	}

	function handleAddSet() {
		if (!exercise) return

		setExercisesSets((prev) =>
			prev.map((es) => {
				if (es.exerciseId !== exercise.id) return es

				const sorted = sortDraftWorkoutSetsByOrderAsc(es.sets)
				const nextOrder = (sorted[sorted.length - 1]?.order ?? 0) + 1

				return {
					...es,
					sets: [
						...es.sets,
						{
							order: nextOrder,
							progressionId:
								sorted[sorted.length - 1]?.progressionId,
							reps: undefined
						}
					]
				}
			})
		)
	}

	function handleCreateProgression() {
		SheetManager.hide("progressions-list")

		if (!exercise) return
		onCreateProgression(exercise.id)
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => setShowDescription((prev) => !prev)}
				activeOpacity={0.7}
				style={styles.nameAndNote}
			>
				<StyledText type="subtitle">
					{exercise?.name ?? t("attributes.exercise-name")}
				</StyledText>

				{exercise?.description && showDescription ? (
					<StyledText type="note" color="grayDark">
						{exercise.description}
					</StyledText>
				) : null}
			</TouchableOpacity>

			<HeaderRow isIsometric={exercise?.is_isometric ?? false} />

			{exercisesSets
				.find((es) => es.exerciseId === exercise?.id)
				?.sets.map((set) => (
					<SetRow
						key={set.order}
						draftSet={set}
						progression={progressions.find(
							(p) => p.id === set.progressionId
						)}
						onDelete={handleDeleteSet}
						onChooseProgression={handleChooseProgression}
					/>
				))}

			<AddSetRow onAddSet={handleAddSet} />
		</View>
	)
}

type HeaderRowProps = {
	isIsometric: boolean
}
function HeaderRow({ isIsometric }: HeaderRowProps) {
	const { t } = useTranslation()

	return (
		<View style={styles.row}>
			<StyledText
				type="boldNote"
				align="center"
				color="grayDark"
				style={[styles.rowText]}
			>
				{t("attributes.SET")}
			</StyledText>

			<StyledText
				type="boldNote"
				color="grayDark"
				style={[styles.rowText, styles.progressionRow]}
			>
				{t("attributes.PROGRESSION")}
			</StyledText>

			<StyledText
				type="boldNote"
				color="grayDark"
				align="center"
				style={[styles.rowText]}
			>
				{isIsometric ? t("attributes.SECS") : t("attributes.REPS")}
			</StyledText>

			<View style={[styles.rowText]}>
				<MCIcon name="trash-can" color="backgroundBlack" />
			</View>
		</View>
	)
}

type AddSetRowProps = {
	onAddSet: () => void
}
function AddSetRow({ onAddSet }: AddSetRowProps) {
	const { t } = useTranslation()

	return (
		<TouchableOpacity
			onPress={onAddSet}
			activeOpacity={0.7}
			style={styles.row}
		>
			<View style={styles.rowText}>
				<MCIcon name="plus" color="primary" />
			</View>

			<StyledText
				type="boldNote"
				color="primary"
				style={[styles.rowText, styles.progressionRow, { flex: 6 }]}
			>
				{t("actions.add-set")}
			</StyledText>
		</TouchableOpacity>
	)
}

type SetRowProps = {
	draftSet: DraftWorkoutSet
	progression: DatabaseProgression | undefined
	onDelete: (set: DraftWorkoutSet) => void
	onChooseProgression: (set: DraftWorkoutSet) => void
}
function SetRow({
	draftSet,
	progression,
	onDelete,
	onChooseProgression
}: SetRowProps) {
	const { t } = useTranslation()

	const [reps, setReps] = useState<string | undefined>(
		draftSet.reps?.toString() ?? undefined
	)

	return (
		<View style={styles.row}>
			<StyledText type="boldText" align="center" style={[styles.rowText]}>
				{draftSet.order ?? t("attributes.SET")}
			</StyledText>

			<TouchableOpacity
				onPress={() => onChooseProgression(draftSet)}
				style={[styles.rowText, styles.progressionRow]}
			>
				<StyledText
					type="text"
					color={draftSet.progressionId ? "textLight" : "grayDark"}
				>
					{draftSet.progressionId && progression
						? progression.name
						: t("actions.choose-progression")}
				</StyledText>
			</TouchableOpacity>

			<View style={[styles.rowText]}>
				<TextInput
					value={reps}
					onChangeText={(txt) => setReps(txt)}
					placeholder="-"
					keyboardType="numeric"
					style={styles.repsInput}
				/>
			</View>

			<TouchableOpacity
				onPress={() => onDelete(draftSet)}
				style={[styles.rowText]}
			>
				<MCIcon name="trash-can" color="textLight" />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: theme.spacing.xxs
	},
	nameAndNote: {
		gap: theme.spacing.xxs,
		paddingHorizontal: theme.spacing.s
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 4
	},
	rowText: {
		flex: 1,
		alignItems: "center"
	},
	progressionRow: {
		flex: 4,
		alignItems: "flex-start",
		paddingLeft: theme.spacing.xxs
	},
	repsInput: {
		fontSize: theme.fontSize.m,
		color: theme.colors.textLight,
		fontWeight: "700"
		// backgroundColor: theme.colors.danger
	}
})
