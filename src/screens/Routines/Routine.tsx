import { isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
import ErrorScreen from "../ErrorScreen"
import i18next from "i18next"
import Loading from "../Loading"
import RoutineInner from "./views/RoutineInner"
import useRoutineQuery from "../../hooks/useRoutineQuery"

export default function Routine({ route }: RootStackScreenProps<"Routine">) {
	const { getRoutineWithDaysById } = useRoutineQuery()

	const { error, data, isPending } = getRoutineWithDaysById(route.params.id)

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

	return <RoutineInner routine={data} />
}
