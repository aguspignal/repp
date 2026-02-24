import {
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise,
	DraftRoutineDayExercise,
	RoutineDayExerciseGoalType
} from "../../../types/routines"
import {
	invalidateQueries,
	isPostgrestError
} from "../../../utils/queriesHelpers"
import {
	GETROUTINEDAYANDEXERCISES_KEY,
	GETROUTINEWITHDAYSANDEXERCISESBYID_KEY
} from "../../../hooks/useRoutineQuery"
import {
	EditRoutineDaySchema,
	EditRoutineDayValues
} from "../../../utils/zodSchemas"
import { DatabaseExercise } from "../../../types/exercises"
import { RootStackNavigationProp } from "../../../navigation/params"
import {
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View
} from "react-native"
import { theme } from "../../../resources/theme"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../../stores/useUserStore"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../../../components/buttons/Button"
import ConfirmationModal from "../../../components/modals/ConfirmationModal"
import EditRoutineDayInput from "../../../components/inputs/EditRoutineDayInput"
import MCIcon from "../../../components/icons/MCIcon"
import RoutineDayExerciseCard from "../../../components/cards/RoutineDayExerciseCard"
import Sortables, { SortableGridRenderItem } from "react-native-sortables"
import StyledText from "../../../components/texts/StyledText"
import ToastNotification from "../../../components/notifications/ToastNotification"
import useKeyboardBehaviour from "../../../hooks/useKeyboardBehaviour"
import useRoutineMutation from "../../../hooks/useRoutineMutation"

type Props = {
	day: DatabaseRoutineDay
	exercises: DatabaseRoutineDayExercise[]
	selectedExercises?: DatabaseExercise[]
}
export default function EditRoutineDayInner({
	day,
	exercises: prevExercises,
	selectedExercises
}: Props) {
	const { t } = useTranslation()

	const { behaviour } = useKeyboardBehaviour()
	const { user, addRoutineDay } = useUserStore()
	const { updateRoutineDayAndExercisesMutation } = useRoutineMutation()
	const nav = useNavigation<RootStackNavigationProp>()

	const { mutate: updateRoutineDayAndExercises, isPending } =
		updateRoutineDayAndExercisesMutation

	const {
		handleSubmit,
		control,
		formState: { isLoading, isSubmitting }
	} = useForm<EditRoutineDayValues>({
		defaultValues: {
			code: day.code ?? "",
			name: day.name ?? ""
		},
		resolver: zodResolver(EditRoutineDaySchema)
	})

	const [confirmationModalVisible, setConfirmationModalVisible] =
		useState(false)
	const [draftRDExercises, setDraftRDExercises] = useState<
		DraftRoutineDayExercise[]
	>(
		prevExercises.map(
			({ id, routineday_id, created_at, ...draftFields }) => draftFields
		)
	)

	function handleSaveChanges({ code, name }: EditRoutineDayValues) {
		if (!user) return

		const upsertExercises: DatabaseRoutineDayExercise[] = draftRDExercises
			.filter((drde) =>
				prevExercises.some((pe) => pe.exercise_id === drde.exercise_id)
			)
			.map((drde) => {
				const rde = prevExercises.find(
					(pe) => pe.exercise_id === drde.exercise_id
				)!

				return {
					...rde,
					...drde,
					order:
						draftRDExercises.findIndex(
							(e) => e.exercise_id === rde.exercise_id
						) + 1
				}
			})

		const insertExercises: DraftRoutineDayExercise[] = draftRDExercises
			.filter(
				(drde) =>
					!prevExercises.some(
						(pe) => pe.exercise_id === drde.exercise_id
					)
			)
			.map((drde) => ({
				...drde,
				order:
					draftRDExercises.findIndex(
						(e) => e.exercise_id === drde.exercise_id
					) + 1
			}))

		const deleteExercisesIds: number[] = prevExercises
			.filter(
				(pe) =>
					!draftRDExercises.some(
						(drde) => drde.exercise_id === pe.exercise_id
					)
			)
			.map((pe) => pe.exercise_id)

		console.log("upsert: ", upsertExercises)
		console.log("deleExercises: ", deleteExercisesIds)
		console.log("insert: ", insertExercises)

		const newDay: DatabaseRoutineDay = { ...day, code, name }

		if (
			upsertExercises.length === 0 &&
			deleteExercisesIds.length === 0 &&
			insertExercises.length === 0 &&
			JSON.stringify(newDay) === JSON.stringify(day)
		) {
			nav.goBack()
			return
		}

		updateRoutineDayAndExercises(
			{
				day: newDay,
				deleteRoutineDayExercisesIds: deleteExercisesIds,
				insertRoutineDayExercises: insertExercises,
				upsertRoutineDayExercises: upsertExercises
			},
			{
				onSuccess: (newRoutineDay) => {
					if (!newRoutineDay || isPostgrestError(newRoutineDay)) {
						ToastNotification({ title: newRoutineDay?.message })
						return
					}

					addRoutineDay(newRoutineDay)
					invalidateQueries(
						GETROUTINEWITHDAYSANDEXERCISESBYID_KEY(
							newRoutineDay.routine_id
						)
					)
					invalidateQueries(GETROUTINEDAYANDEXERCISES_KEY(user?.id))
					setConfirmationModalVisible(false)
					nav.reset({
						index: 0,
						routes: [
							{ name: "Home" },
							{
								name: "Routine",
								params: { id: newRoutineDay.routine_id }
							}
						]
					})
				}
			}
		)
	}

	function handleAddExercise() {
		nav.navigate("ExerciseRepository", { editingRoutineDayId: day.id })
	}

	function handleDeleteExercise(draftRDE: DraftRoutineDayExercise) {
		setDraftRDExercises((prev) =>
			prev.filter((de) => de.exercise_id !== draftRDE.exercise_id)
		)
	}

	function handleUpdateNote(draftRDE: DraftRoutineDayExercise, note: string) {
		setDraftRDExercises((prev) =>
			prev.map((drde) => {
				if (drde.exercise_id !== draftRDE.exercise_id) return drde

				return {
					...drde,
					note
				}
			})
		)
	}

	function handleUpdateGoal(
		draftRDE: DraftRoutineDayExercise,
		goal: number | null,
		goalType: RoutineDayExerciseGoalType
	) {
		setDraftRDExercises((prev) =>
			prev.map((drde) => {
				if (drde.exercise_id !== draftRDE.exercise_id) return drde

				return {
					...drde,
					set_goal_high:
						goalType === "setsHigh" ? goal : drde.set_goal_high,
					set_goal_low:
						goalType === "setsLow" ? goal : drde.set_goal_low,
					rep_goal_high:
						goalType === "repsHigh" ? goal : drde.rep_goal_high,
					rep_goal_low:
						goalType === "repsLow" ? goal : drde.rep_goal_low
				}
			})
		)
	}

	useEffect(() => {
		if (!selectedExercises) return

		const notIncluded: DraftRoutineDayExercise[] = selectedExercises
			.filter(
				(se) => !draftRDExercises.some((de) => de.exercise_id === se.id)
			)
			.map((se) => ({
				exercise_id: se.id,
				order: -1,
				note: null,
				set_goal_high: null,
				set_goal_low: null,
				rep_goal_high: null,
				rep_goal_low: null
			}))

		setDraftRDExercises((prev) => prev.concat(notIncluded))
	}, [selectedExercises])

	const exerciseRenderItem = useCallback<
		SortableGridRenderItem<DraftRoutineDayExercise>
	>(
		({ item, index }) => (
			<RoutineDayExerciseCard
				draftRDExercise={item}
				index={index}
				onDelete={handleDeleteExercise}
				onUpdateNote={handleUpdateNote}
				onUpdateGoal={handleUpdateGoal}
			/>
		),
		[]
	)

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={behaviour}>
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
			>
				<View style={styles.codeAndName}>
					<EditRoutineDayInput name="code" control={control} />
					<EditRoutineDayInput name="name" control={control} />
				</View>

				<View style={styles.exercisesContainer}>
					<StyledText type="subtitle">
						{t("titles.exercises")}
					</StyledText>

					<Sortables.Grid
						data={draftRDExercises}
						keyExtractor={(item) => item.exercise_id.toString()}
						renderItem={exerciseRenderItem}
						onDragEnd={({ data }) => setDraftRDExercises(data)}
						columns={1}
						rowGap={theme.spacing.xxs}
						overDrag="vertical"
						activeItemScale={1.05}
						customHandle
					/>
				</View>

				<TouchableOpacity
					onPress={handleAddExercise}
					style={styles.addExerciseBtn}
				>
					<MCIcon name="plus" color="primary" size="xxl" />

					<StyledText type="boldText" color="primary">
						{t("actions.add-exercises-from-repository")}
					</StyledText>
				</TouchableOpacity>

				<Button
					title={t("actions.save-changes")}
					onPress={() => setConfirmationModalVisible(true)}
					isLoading={isLoading || isSubmitting || isPending}
				/>
			</ScrollView>

			<ConfirmationModal
				isVisible={confirmationModalVisible}
				setIsVisible={setConfirmationModalVisible}
				title={t("questions.sure-want-to-save-changes")}
				confirmText={t("actions.save")}
				onConfirm={handleSubmit(handleSaveChanges)}
				isLoadingConfirm={isPending}
			/>
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
		justifyContent: "space-between",
		paddingBottom: theme.spacing.x4l,
		gap: theme.spacing.l
	},
	codeAndName: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xs
	},
	exercisesContainer: {
		gap: theme.spacing.xs
	},
	addExerciseBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xxs
	}
})
