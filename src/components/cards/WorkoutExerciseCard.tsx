import {
	sortDraftWorkoutSetsByOrderAsc,
	sortProgressionsByOrderDesc
} from "../../utils/sorting"
import {
	DatabaseProgression,
	ExerciseWithProgressions
} from "../../types/exercises"
import { Dispatch, SetStateAction, useMemo, useState } from "react"
import { DraftWorkoutSet, ExerciseIdWithDraftSets } from "../../types/workouts"
import { parseGoalsToText, parseNumericInput } from "../../utils/parsing"
import { RoutineDayExerciseGoals } from "../../types/routines"
import { SheetManager } from "react-native-actions-sheet"
import { SheetOption } from "../../lib/sheets"
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import { useTranslation } from "react-i18next"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"
import IconButton from "../buttons/IconButton"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../navigation/params"

type Props = {
	exerciseAndProgressions: ExerciseWithProgressions
	exerciseNote: string | null
	goals: RoutineDayExerciseGoals
	workoutSets: ExerciseIdWithDraftSets[]
	setWorkoutSets: Dispatch<SetStateAction<ExerciseIdWithDraftSets[]>>
	onCreateProgression: (eId: number) => void
}

export default function WorkoutExerciseCard({
	exerciseAndProgressions: { exercise, progressions },
	exerciseNote,
	goals,
	workoutSets,
	setWorkoutSets,
	onCreateProgression
}: Props) {
	const { t } = useTranslation()
	const nav = useNavigation<RootStackNavigationProp>()

	const goalsText = useMemo(
		() => parseGoalsToText(goals, exercise?.is_isometric),
		[goals]
	)

	const [showNote, setShowNote] = useState(true)

	function handleDeleteSet(set: DraftWorkoutSet) {
		if (!exercise) return

		setWorkoutSets((prev) =>
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

	function handleChooseProgression(draftSet: DraftWorkoutSet) {
		const sheetOptions: SheetOption[] = [
			...sortProgressionsByOrderDesc(progressions).map((p) => ({
				label: p.name,
				onPress: () => handleAddProgression(draftSet, p.id)
			})),
			{
				label: t("actions.add-progression"),
				onPress: handleCreateProgression,
				textColor: "primary"
			}
		]

		const noProgressionsOption: SheetOption = {
			label: t("messages.this-exercise-doesnt-have-any-progressions"),
			onPress: () => {},
			textColor: "grayDark"
		}

		SheetManager.show("progressions-list", {
			payload: {
				options:
					sheetOptions.length > 1
						? sheetOptions
						: [noProgressionsOption, ...sheetOptions]
			}
		})
	}

	function handleAddProgression(draftSet: DraftWorkoutSet, progId: number) {
		if (!exercise) return

		setWorkoutSets((prev) =>
			prev.map((es) =>
				es.exerciseId !== exercise.id
					? es
					: {
							...es,
							sets: es.sets.map((s) =>
								s.order === draftSet.order
									? { ...s, progression_id: progId }
									: s
							)
						}
			)
		)

		SheetManager.hide("progressions-list")
	}

	function handleAddSet() {
		if (!exercise) return

		setWorkoutSets((prev) =>
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
							progression_id:
								sorted[sorted.length - 1]?.progression_id,
							reps: 0
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

	function handleUpdateReps(draftSet: DraftWorkoutSet, reps: number | null) {
		if (!exercise) return

		setWorkoutSets((prev) =>
			prev.map((es) => {
				if (es.exerciseId !== exercise.id) return es

				return {
					...es,
					sets: es.sets.map((s) =>
						s.order === draftSet.order
							? { ...s, reps: reps ?? 0 }
							: s
					)
				}
			})
		)
	}

	function goToHistory() {
		nav.navigate("ExerciseHistory", { id: exercise.id })
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => setShowNote((prev) => !prev)}
				activeOpacity={0.7}
				style={[styles.row, styles.header]}
			>
				<View style={styles.nameAndNote}>
					<StyledText type="subtitle">
						{exercise?.name ?? t("attributes.exercise-name")}
					</StyledText>

					{exerciseNote && showNote ? (
						<StyledText type="note" color="grayDark">
							{exerciseNote}
						</StyledText>
					) : null}

					{goalsText ? (
						<StyledText type="boldNote" color="secondary">
							{goalsText}
						</StyledText>
					) : null}
				</View>

				<IconButton
					icon="history"
					onPress={goToHistory}
					color="textLight"
				/>
			</TouchableOpacity>

			<HeaderRow isIsometric={exercise?.is_isometric ?? false} />

			{workoutSets
				.find((es) => es.exerciseId === exercise?.id)
				?.sets.map((set) => (
					<SetRow
						key={set.order}
						draftSet={set}
						progression={progressions.find(
							(p) => p.id === set.progression_id
						)}
						onDelete={handleDeleteSet}
						onChooseProgression={handleChooseProgression}
						onUpdateReps={handleUpdateReps}
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
	onChooseProgression: (draftSet: DraftWorkoutSet) => void
	onUpdateReps: (draftSet: DraftWorkoutSet, reps: number | null) => void
}
function SetRow({
	draftSet,
	progression,
	onDelete,
	onChooseProgression,
	onUpdateReps
}: SetRowProps) {
	const { t } = useTranslation()

	const [reps, setReps] = useState<string>(draftSet.reps?.toString() ?? "")

	function handleChange(txt: string) {
		const num = parseNumericInput(txt, setReps)
		onUpdateReps(draftSet, num)
	}

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
					color={draftSet.progression_id ? "textLight" : "grayDark"}
				>
					{draftSet.progression_id && progression
						? progression.name
						: t("actions.choose-progression")}
				</StyledText>
			</TouchableOpacity>

			<View style={[styles.rowText]}>
				<TextInput
					value={reps}
					onChangeText={(txt) => handleChange(txt)}
					placeholder="-"
					keyboardType="numeric"
					maxLength={3}
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
	header: {
		paddingHorizontal: theme.spacing.s
	},
	nameAndNote: {
		gap: theme.spacing.xxs
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
