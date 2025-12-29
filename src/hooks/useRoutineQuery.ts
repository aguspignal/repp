import { PostgrestError } from "@supabase/supabase-js"
import { RoutineAndDays } from "../types/routines"
import { useQuery } from "@tanstack/react-query"
import routinesService from "../services/routinesService"

const RQKEY_ROOT = "routinesQueries"
const GETROUTINEWITHDAYSBYID_KEY = (id: number) => [RQKEY_ROOT, id]
const GETUSERROUTINESWITHDAYSLAZY_KEY = (uId: number) => [
	RQKEY_ROOT,
	"userRoutines",
	uId
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

	return {
		getRoutineWithDaysById,
		getUserRoutinesWithDaysLazy
	}
}
