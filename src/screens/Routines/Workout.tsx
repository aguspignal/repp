import { DraftWorkoutAndSets } from "../../types/routines"
import { isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
import ErrorScreen from "../ErrorScreen"
import i18next from "i18next"
import Loading from "../Loading"
import ToastNotification from "../../components/notifications/ToastNotification"
import useRoutineMutation from "../../hooks/useRoutineMutation"
import useRoutineQuery from "../../hooks/useRoutineQuery"
import WorkoutInner from "./views/WorkoutInner"

export default function Workout({
	navigation,
	route
}: RootStackScreenProps<"Workout">) {
	const { getRoutineDayAndExercises } = useRoutineQuery()
	const { createWorkoutAndSetsMutation } = useRoutineMutation()

	const { mutate: createWorkoutAndSets, isPending: isPendingCreate } =
		createWorkoutAndSetsMutation

	const { data, error, isPending } = getRoutineDayAndExercises(
		route.params.dayId
	)

	function handleCreateWorkout({
		insertSets,
		draftWorkout
	}: DraftWorkoutAndSets) {
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
					navigation.reset({ index: 0, routes: [{ name: "Home" }] })
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
