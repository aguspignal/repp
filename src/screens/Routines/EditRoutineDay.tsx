import { isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
import EditRoutineDayInner from "./views/EditRoutineDayInner"
import ErrorScreen from "../ErrorScreen"
import i18next from "i18next"
import Loading from "../Loading"
import useRoutineQuery from "../../hooks/useRoutineQuery"

export default function EditRoutineDay({
	route
}: RootStackScreenProps<"EditRoutineDay">) {
	const { getRoutineDayAndExercises } = useRoutineQuery()

	const { data, error, isPending } = getRoutineDayAndExercises(
		route.params.id
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

	return (
		<EditRoutineDayInner
			day={data.day}
			exercises={data.exercises}
			selectedExercises={route.params.selectedExercises}
		/>
	)
}
