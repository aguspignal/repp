import {
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise,
	DraftRoutineDayExercise
} from "../../../types/routines"
import {
	invalidateQueries,
	isPostgrestError
} from "../../../utils/queriesHelpers"
import {
	GETROUTINEDAYANDEXERCISES_KEY,
	GETROUTINEWITHDAYSANDEXERCISESBYID_KEY
} from "../../../hooks/useRoutineQuery"
import { DatabaseExercise } from "../../../types/exercises"
import { EditRoutineDayValidationSchema } from "../../../utils/valdiationSchemas"
import { EditRoutineDayValues } from "../../../types/forms"
import { RootStackNavigationProp } from "../../../navigation/params"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../../resources/theme"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../../stores/useUserStore"
import { yupResolver } from "@hookform/resolvers/yup"
import Button from "../../../components/buttons/Button"
import EditRoutineDayInput from "../../../components/inputs/EditRoutineDayInput"
import MCIcon from "../../../components/icons/MCIcon"
import Sortables, { SortableGridRenderItem } from "react-native-sortables"
import StyledText from "../../../components/texts/StyledText"
import ToastNotification from "../../../components/notifications/ToastNotification"
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
	const { user, exercises, addRoutineDay } = useUserStore()
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
		resolver: yupResolver(EditRoutineDayValidationSchema)
	})

	const [exercisesList, setExercisesList] = useState<DatabaseExercise[]>(
		prevExercises
			.map((pe) => exercises.filter((e) => e.id === pe.exercise_id)[0])
			.filter((e) => e !== undefined)
	)

	function handleSaveChanges({ code, name }: EditRoutineDayValues) {
		if (!user) return

		const upsertExercises: DatabaseRoutineDayExercise[] = exercisesList
			.filter((e) => prevExercises.some((pe) => pe.exercise_id === e.id))
			.map((e) => {
				const rde = prevExercises.find((pe) => pe.exercise_id === e.id)!
				return {
					...rde,
					order:
						exercisesList.findIndex(
							(ie) => ie.id === rde?.exercise_id
						) + 1
				}
			})

		const insertExercises: DraftRoutineDayExercise[] = exercisesList
			.filter((e) => !prevExercises.some((pe) => pe.exercise_id === e.id))
			.map((e) => ({
				exerciseId: e.id,
				order: exercisesList.findIndex((ie) => ie.id === e.id) + 1,
				repsGoalHigh: null,
				repsGoalLow: null,
				setsGoalHigh: null,
				setsGoalLow: null
			}))

		const deleteExercisesIds: number[] = prevExercises
			.filter((pe) => !exercisesList.some((e) => e.id === pe.exercise_id))
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

	function handleDeleteExercise(exercise: DatabaseExercise) {
		setExercisesList((prev) => prev.filter((e) => e.id !== exercise.id))
	}

	useEffect(() => {
		if (!selectedExercises) return

		const notIncluded = selectedExercises?.filter(
			(se) => !exercisesList.some((e) => e.id === se.id)
		)

		setExercisesList((prev) => prev.concat(notIncluded))
	}, [selectedExercises])

	const exerciseRenderItem = useCallback<
		SortableGridRenderItem<DatabaseExercise>
	>(
		({ item: e, index }) => (
			<View key={e.id} style={styles.draggableExercise}>
				<View style={styles.draggableSubcontainer}>
					<StyledText type="boldText">{index + 1}</StyledText>
					<StyledText type="boldText">{e.name}</StyledText>
					<StyledText type="note">{e.id}</StyledText>
				</View>

				<View style={styles.draggableSubcontainer}>
					<TouchableOpacity onPress={() => handleDeleteExercise(e)}>
						<MCIcon name="trash-can" />
					</TouchableOpacity>

					<Sortables.Handle>
						<MCIcon name="drag-vertical" />
					</Sortables.Handle>
				</View>
			</View>
		),
		[]
	)

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
		>
			<View style={styles.codeAndName}>
				<EditRoutineDayInput name="code" control={control} />
				<EditRoutineDayInput name="name" control={control} />
			</View>

			<View style={styles.exercisesContainer}>
				<StyledText type="subtitle">{t("titles.exercises")}</StyledText>

				<Sortables.Grid
					data={exercisesList}
					renderItem={exerciseRenderItem}
					onDragEnd={({ data }) => setExercisesList(data)}
					columns={1}
					rowGap={theme.spacing.xxs}
					overDrag="vertical"
					activeItemScale={1.05}
					customHandle
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

			<Button
				title={t("actions.save-changes")}
				onPress={handleSubmit(handleSaveChanges)}
				isLoading={isLoading || isSubmitting || isPending}
			/>
		</ScrollView>
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
		gap: theme.spacing.xl
	},
	codeAndName: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xs
	},
	exercisesContainer: {
		gap: theme.spacing.s
	},
	addExerciseBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xxs
	},
	draggableExercise: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingLeft: theme.spacing.xxs,
		paddingVertical: theme.spacing.xxs
	},
	draggableSubcontainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.s
	}
})
