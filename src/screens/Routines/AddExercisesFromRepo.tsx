import { isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
import { sortExercisesAndProgressionsBy } from "../../utils/sorting"
import { useEffect } from "react"
import { useUserStore } from "../../stores/useUserStore"
import ErrorScreen from "../ErrorScreen"
import ExerciseRepoInner from "../Exercises/views/ExerciseRepoInner"
import Loading from "../Loading"
import useExercisesQuery from "../../hooks/useExercisesQuery"

export default function AddExercisesFromRepo({
	route: {
		params: { dayId }
	}
}: RootStackScreenProps<"AddExercisesFromRepo">) {
	const { user, loadExercisesAndProgressions } = useUserStore()
	const { getUserExercisesAndProgressions } = useExercisesQuery()

	const { data, isPending } = getUserExercisesAndProgressions(user?.id)

	useEffect(() => {
		if (data && !isPostgrestError(data)) {
			loadExercisesAndProgressions(
				sortExercisesAndProgressionsBy(data, "descending")
			)
		}
	}, [data])

	if (isPending) return <Loading />
	if (!data) return <ErrorScreen />
	if (isPostgrestError(data))
		return <ErrorScreen errorMessage={data.message} />

	return <ExerciseRepoInner exercisesWithProgressions={data} dayId={dayId} />
}
