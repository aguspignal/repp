import {
	DatabaseWorkoutSet,
	WorkoutUpdatePayload,
	WorkoutWithSets
} from "../../types/workouts"
import { isPostgrestError } from "../../utils/queriesHelpers"
import { PostgrestError } from "@supabase/supabase-js"
import { RootStackScreenProps } from "../../navigation/params"
import ErrorScreen from "../ErrorScreen"
import i18next from "i18next"
import Loading from "../Loading"
import ToastNotification from "../../components/notifications/ToastNotification"
import useRoutineQuery from "../../hooks/useRoutineQuery"
import useWorkoutMutation from "../../hooks/useWorkoutMutation"
import useWorkoutQuery from "../../hooks/useWorkoutQuery"
import WorkoutInner from "./views/WorkoutInner"

export default function EditWorkout({
	navigation,
	route
}: RootStackScreenProps<"EditWorkout">) {
	const { updateWorkoutAndSetsMutation, updateWorkoutSetsMutation } =
		useWorkoutMutation()
	const { getRoutineDayAndExercises } = useRoutineQuery()
	const { getWorkoutAndSetsById } = useWorkoutQuery()

	const { mutate: updateWorkoutAndSets, isPending: isPendingWorkoutAndSets } =
		updateWorkoutAndSetsMutation
	const { mutate: updateSets, isPending: isPendingSets } =
		updateWorkoutSetsMutation

	const {
		data: dayAndExercises,
		error: dayError,
		isPending: isPendingDay
	} = getRoutineDayAndExercises(route.params.dayId)

	const {
		data: workoutAndSets,
		error: workoutError,
		isPending: isPendingWorkout
	} = getWorkoutAndSetsById(route.params.wId)

	function handleSaveChanges({
		insertSets,
		upsertSets,
		deleteSets,
		draftWorkout
	}: WorkoutUpdatePayload) {
		if (!workoutAndSets || isPostgrestError(workoutAndSets)) return

		const { date, note } = workoutAndSets.workout

		if (date === draftWorkout.date && note === draftWorkout.note)
			updateSets(
				{
					workoutId: route.params.wId,
					insertSets,
					upsertSets,
					deleteSets
				},
				{ onSuccess: (result) => onMutationSuccess(result) }
			)
		else
			updateWorkoutAndSets(
				{
					workout: {
						...workoutAndSets.workout,
						date: draftWorkout.date,
						note: draftWorkout.note
					},
					insertSets,
					upsertSets,
					deleteSets
				},
				{ onSuccess: (result) => onMutationSuccess(result) }
			)
	}

	function onMutationSuccess(
		result: WorkoutWithSets | DatabaseWorkoutSet[] | null | PostgrestError
	) {
		if (!result || isPostgrestError(result)) {
			ToastNotification({
				title: result?.message
			})
		}
		navigation.reset({
			index: 0,
			routes: [
				{
					name: "Tabs",
					params: {
						screen: "RoutinesTab",
						params: { screen: "MyRoutines" }
					}
				}
			]
		})
	}

	if (isPendingDay || isPendingWorkout) return <Loading />
	if (dayError) return <ErrorScreen errorMessage={dayError.message} />
	if (workoutError) return <ErrorScreen errorMessage={workoutError.message} />
	if (!dayAndExercises || isPostgrestError(dayAndExercises))
		return (
			<ErrorScreen
				errorMessage={
					dayAndExercises
						? dayAndExercises.message
						: i18next.t("error-messages.trouble-getting-routine")
				}
			/>
		)
	if (!workoutAndSets || isPostgrestError(workoutAndSets))
		return (
			<ErrorScreen
				errorMessage={
					workoutAndSets
						? workoutAndSets.message
						: i18next.t("error-messages.trouble-getting-routine")
				}
			/>
		)

	return (
		<WorkoutInner
			routineDay={dayAndExercises.day}
			dayExercises={dayAndExercises.exercises}
			workoutData={workoutAndSets}
			onSubmit={handleSaveChanges}
			isLoadingAction={isPendingWorkoutAndSets || isPendingSets}
		/>
	)
}
