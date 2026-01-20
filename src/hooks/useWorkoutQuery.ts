import workoutsService, {
	GetWorkoutsAndSetsInRangeByDayIdParams
} from "../services/workoutsService"
import { PostgrestError } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import { WorkoutWithSets } from "../types/workouts"

const RQKEY_ROOT = "workoutQueries"

export const GETWORKOUTSANDSETSINRANGEBYDAYID_KEY = (
	dId: number,
	rf: number,
	rt: number
) => [RQKEY_ROOT, "dayWorkoutsAndSetsInRange", dId, rf, rt]

export const GETWORKOUTANDSETSBYID_KEY = (wId: number) => [
	RQKEY_ROOT,
	"workoutAndSetsById",
	wId
]

export default function useWorkoutQuery() {
	function getWorkoutsAndSetsInRangeByDayId(
		params: GetWorkoutsAndSetsInRangeByDayIdParams
	) {
		return useQuery<WorkoutWithSets[] | PostgrestError>({
			queryKey: GETWORKOUTSANDSETSINRANGEBYDAYID_KEY(
				params.dayId,
				params.rangeFrom,
				params.rangeTo
			),
			queryFn: async () => {
				return await workoutsService.fetchWorkoutsAndSetsInRangeByDayId(
					params
				)
			}
		})
	}

	function getWorkoutAndSetsById(wId: number | undefined) {
		return useQuery<WorkoutWithSets | null | PostgrestError>({
			queryKey: GETWORKOUTANDSETSBYID_KEY(wId ?? 0),
			queryFn: async () => {
				if (!wId) return null
				return await workoutsService.fetchWorkoutAndSetsById(wId)
			}
		})
	}

	return {
		getWorkoutsAndSetsInRangeByDayId,
		getWorkoutAndSetsById
	}
}
