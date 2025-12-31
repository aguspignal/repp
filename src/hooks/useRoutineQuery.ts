import { PostgrestError } from "@supabase/supabase-js"
import { RoutineAndDays, RoutineDayAndExercises } from "../types/routines"
import { useQuery } from "@tanstack/react-query"
import routinesService from "../services/routinesService"

const RQKEY_ROOT = "routinesQueries"
export const GETROUTINEWITHDAYSBYID_KEY = (id: number) => [RQKEY_ROOT, id]
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
	function getRoutineWithDaysById(id: number | undefined) {
		return useQuery<RoutineAndDays | null | PostgrestError>({
			queryKey: GETROUTINEWITHDAYSBYID_KEY(id ?? 0),
			queryFn: async () => {
				if (!id) return null
				return await routinesService.getRoutineWithDaysById(id)
			}
		})
	}

	function getUserRoutinesWithDaysLazy(userId: number | undefined) {
		return useQuery<RoutineAndDays[] | PostgrestError>({
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
		getRoutineWithDaysById,
		getUserRoutinesWithDaysLazy,
		getRoutineDayAndExercises
	}
}
