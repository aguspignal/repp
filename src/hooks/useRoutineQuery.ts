import {
	RoutineWithDaysAndExercises,
	RoutineDayAndExercises,
	RoutineWithDays,
	DatabaseRoutine,
	DatabaseWorkout,
	WorkoutAndSets
} from "../types/routines"
import { PostgrestError } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import routinesService, {
	GetRoutineDayWorkoutsAndSetsInRangeParams
} from "../services/routinesService"

const RQKEY_ROOT = "routinesQueries"

export const GETROUTINEBYID_KEY = (id: number) => [RQKEY_ROOT, id]
export const GETROUTINEWITHDAYSANDEXERCISESBYID_KEY = (id: number) => [
	RQKEY_ROOT,
	"routineDaysAndExercises",
	id
]
export const GETUSERROUTINESWITHDAYSLAZY_KEY = (uId: number) => [
	RQKEY_ROOT,
	"userRoutinesLazy",
	uId
]
export const GETROUTINEDAYANDEXERCISES_KEY = (rdId: number) => [
	RQKEY_ROOT,
	"dayAndExercises",
	rdId
]
export const GETROUTINEDAYWORKOUTSANDSETSINRANGE_KEY = (
	dId: number,
	rf: number,
	rt: number
) => [RQKEY_ROOT, "dayWorkoutsAndSetsInRange", dId, rf, rt]

export const GETROUTINEDAYALLTIMEWORKOUTSCOUNT_KEY = (dId: number) => [
	RQKEY_ROOT,
	"dayAllTimeWorkoutsCount",
	dId
]

export default function useRoutineQuery() {
	function getRoutineById(id: number | undefined) {
		return useQuery<DatabaseRoutine | null | PostgrestError>({
			queryKey: GETROUTINEBYID_KEY(id ?? 0),
			queryFn: async () => {
				if (!id) return null
				return await routinesService.getRoutineById(id)
			}
		})
	}

	function getRoutineWithDaysAndExercisesById(id: number | undefined) {
		return useQuery<RoutineWithDaysAndExercises | null | PostgrestError>({
			queryKey: GETROUTINEWITHDAYSANDEXERCISESBYID_KEY(id ?? 0),
			queryFn: async () => {
				if (!id) return null
				return await routinesService.getRoutineWithDaysAndExercisesById(
					id
				)
			}
		})
	}

	function getUserRoutinesWithDaysLazy(userId: number | undefined) {
		return useQuery<RoutineWithDays[] | PostgrestError>({
			queryKey: GETUSERROUTINESWITHDAYSLAZY_KEY(userId ?? 0),
			queryFn: async () => {
				if (!userId) return []
				return await routinesService.getRoutinesWithDaysByUserId(userId)
			},
			enabled: false
		})
	}

	function getRoutineDayAndExercises(dayId: number) {
		return useQuery<RoutineDayAndExercises | null | PostgrestError>({
			queryKey: GETROUTINEDAYANDEXERCISES_KEY(dayId ?? 0),
			queryFn: async () => {
				return await routinesService.getRoutineDayAndExercises(dayId)
			}
		})
	}

	function getRoutineDayWorkoutsAndSetsInRange(
		params: GetRoutineDayWorkoutsAndSetsInRangeParams
	) {
		return useQuery<WorkoutAndSets[] | PostgrestError>({
			queryKey: GETROUTINEDAYWORKOUTSANDSETSINRANGE_KEY(
				params.dayId,
				params.rangeFrom,
				params.rangeTo
			),
			queryFn: async () => {
				return await routinesService.getRoutineDayWorkoutsAndSetsInRange(
					params
				)
			}
		})
	}

	function getRoutineDayAllTimeWorkoutsCount(dayId: number) {
		return useQuery<number | PostgrestError>({
			queryKey: GETROUTINEDAYALLTIMEWORKOUTSCOUNT_KEY(dayId),
			queryFn: async () => {
				return await routinesService.countRoutineDayAllTimeWorkouts(
					dayId
				)
			}
		})
	}

	return {
		getRoutineById,
		getRoutineWithDaysAndExercisesById,
		getUserRoutinesWithDaysLazy,
		getRoutineDayAndExercises,
		getRoutineDayWorkoutsAndSetsInRange,
		getRoutineDayAllTimeWorkoutsCount
	}
}
