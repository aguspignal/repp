import {
	RoutineWithDaysAndExercises,
	DatabaseRoutine,
	RoutineWithDays,
	RoutineDayWithExercises,
	DatabaseSchedule
} from "../types/routines"
import { PostgrestError } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import routinesService from "../services/routinesService"
import workoutsService from "../services/workoutsService"

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

export const GETROUTINEDAYALLTIMEWORKOUTSCOUNT_KEY = (dId: number) => [
	RQKEY_ROOT,
	"dayAllTimeWorkoutsCount",
	dId
]

export const GETROUTINESCHEDULE_KEY = (rId: number) => [
	RQKEY_ROOT,
	"routineSchedule",
	rId
]

export default function useRoutineQuery() {
	function getRoutineById(id: number | undefined) {
		return useQuery<DatabaseRoutine | null | PostgrestError>({
			queryKey: GETROUTINEBYID_KEY(id ?? 0),
			queryFn: async () => {
				if (!id) return null
				return await routinesService.fetchRoutineById(id)
			}
		})
	}

	function getRoutineWithDaysAndExercisesById(id: number | undefined) {
		return useQuery<RoutineWithDaysAndExercises | null | PostgrestError>({
			queryKey: GETROUTINEWITHDAYSANDEXERCISESBYID_KEY(id ?? 0),
			queryFn: async () => {
				if (!id) return null
				return await routinesService.fetchRoutineWithDaysAndExercisesById(
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
				return await routinesService.fetchRoutinesWithDaysByUserId(
					userId
				)
			},
			enabled: false
		})
	}

	function getRoutineDayAndExercises(dayId: number) {
		return useQuery<RoutineDayWithExercises | null | PostgrestError>({
			queryKey: GETROUTINEDAYANDEXERCISES_KEY(dayId ?? 0),
			queryFn: async () => {
				return await routinesService.fetchRoutineDayAndExercises(dayId)
			}
		})
	}

	function getRoutineDayAllTimeWorkoutsCount(dayId: number) {
		return useQuery<number | PostgrestError>({
			queryKey: GETROUTINEDAYALLTIMEWORKOUTSCOUNT_KEY(dayId),
			queryFn: async () => {
				return await workoutsService.countRoutineDayAllTimeWorkouts(
					dayId
				)
			}
		})
	}

	function getRoutineSchedule(rId: number) {
		return useQuery<DatabaseSchedule[] | PostgrestError>({
			queryKey: GETROUTINESCHEDULE_KEY(rId ?? 0),
			queryFn: async () => {
				return await routinesService.fetchRoutineSchedule(rId)
			}
		})
	}

	return {
		getRoutineById,
		getRoutineWithDaysAndExercisesById,
		getUserRoutinesWithDaysLazy,
		getRoutineDayAndExercises,
		getRoutineDayAllTimeWorkoutsCount,
		getRoutineSchedule
	}
}
