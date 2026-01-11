import { isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
import ErrorScreen from "../ErrorScreen"
import i18next from "i18next"
import Loading from "../Loading"
import useRoutineQuery from "../../hooks/useRoutineQuery"
import WorkoutInner from "./views/WorkoutInner"

export default function Workout({ route }: RootStackScreenProps<"Workout">) {
	const { getRoutineDayAndExercises } = useRoutineQuery()

	const { data, error, isPending } = getRoutineDayAndExercises(
		route.params.dayId
	)

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

	return <WorkoutInner routineDay={data.day} dayExercises={data.exercises} />
}
