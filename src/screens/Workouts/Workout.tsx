import { isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
import { WorkoutUpdatePayload } from "../../types/workouts"
import ErrorScreen from "../ErrorScreen"
import i18next from "i18next"
import Loading from "../Loading"
import ToastNotification from "../../components/notifications/ToastNotification"
import useRoutineQuery from "../../hooks/useRoutineQuery"
import useWorkoutMutation from "../../hooks/useWorkoutMutation"
import WorkoutInner from "./views/WorkoutInner"

export default function Workout({
	navigation,
	route
}: RootStackScreenProps<"Workout">) {
	const { getRoutineDayAndExercises } = useRoutineQuery()
	const { createWorkoutAndSetsMutation } = useWorkoutMutation()

	const { mutate: createWorkoutAndSets, isPending: isPendingCreate } =
		createWorkoutAndSetsMutation

	const { data, error, isPending } = getRoutineDayAndExercises(
		route.params.dayId
	)

	function handleCreateWorkout({
		insertSets,
		draftWorkout
	}: WorkoutUpdatePayload) {
		createWorkoutAndSets(
			{
				date: draftWorkout.date,
				note: draftWorkout.note,
				routineDayId: draftWorkout.routineday_id,
				draftSets: insertSets
			},
			{
				onSuccess: (workoutAndSets) => {
					if (!workoutAndSets || isPostgrestError(workoutAndSets)) {
						ToastNotification({ title: workoutAndSets?.message })
						return
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
			}
		)
	}

	if (isPending) return <Loading />
	if (error) return <ErrorScreen errorMessage={error.message} />
	if (!data || isPostgrestError(data))
		return (
			<ErrorScreen
				errorMessage={
					data
						? data.message
						: i18next.t("error-messages.trouble-getting-routine")
				}
			/>
		)

	return (
		<WorkoutInner
			routineDay={data.day}
			dayExercises={data.exercises}
			workoutData={null}
			onSubmit={handleCreateWorkout}
			isLoadingAction={isPendingCreate}
		/>
	)
}
