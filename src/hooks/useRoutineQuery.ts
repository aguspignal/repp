import {
	RoutineWithDaysAndExercises,
	RoutineDayAndExercises,
	RoutineWithDays
} from "../types/routines"
import { PostgrestError } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import routinesService from "../services/routinesService"

const RQKEY_ROOT = "routinesQueries"
export const GETROUTINEWITHDAYSANDEXERCISESBYID_KEY = (id: number) => [
	RQKEY_ROOT,
	id
]
export const GETUSERROUTINESWITHDAYSLAZY_KEY = (uId: number) => [
	RQKEY_ROOT,
	"userRoutines",
	uId
]
export const GETROUTINEDAYANDEXERCISES_KEY = (rdId: number) => [
	RQKEY_ROOT,
	"dayExercises",
	rdId
]

export default function useRoutineQuery() {
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

	return {
		getRoutineWithDaysAndExercisesById,
		getUserRoutinesWithDaysLazy,
		getRoutineDayAndExercises
	}
}
