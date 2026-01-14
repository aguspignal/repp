import { DatabaseUser, InitialData } from "../types/user"
import { ExerciseAndProgressions } from "../types/exercises"
import { isPostgrestError } from "../utils/queriesHelpers"
import { PostgrestError } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import { useUserStore } from "../stores/useUserStore"
import exercisesService from "../services/exercisesService"
import i18next from "i18next"
import routinesService from "../services/routinesService"
import ToastNotification from "../components/notifications/ToastNotification"
import userService from "../services/userService"

const RQKEY_ROOT = "user"
export const GETUSERBYUUID_KEY = (uuid: string) => [
	RQKEY_ROOT,
	"getbyuuid",
	uuid
]
export const GETANDUPDATEINITIALDATABYUUID_KEY = (uuid: string) => [
	RQKEY_ROOT,
	"initialDataByUuid",
	uuid
]

export default function useUserQuery() {
	const { loadUser, loadExercisesAndProgressions, loadRoutines } =
		useUserStore()

	function getUserByUuid(uuid: string | undefined) {
		return useQuery<DatabaseUser | null | PostgrestError>({
			queryKey: GETUSERBYUUID_KEY(uuid ?? ""),
			queryFn: async () => {
				if (!uuid) return null
				return await userService.fetchUserByUuid(uuid)
			}
		})
	}

	function getAndUpdateInitialDataByUuid(uuid: string | undefined) {
		return useQuery<InitialData>({
			queryKey: GETANDUPDATEINITIALDATABYUUID_KEY(uuid ?? ""),
			queryFn: async () => {
				if (!uuid) return { user: null, exercises: [], routines: [] }

				const user = await userService.fetchUserByUuid(uuid)
				if (!user || isPostgrestError(user))
					throw new Error(i18next.t("error-messages.user-not-found"))

				let exercises = await exercisesService.fetchExercisesByUserId(
					user.id
				)
				if (isPostgrestError(exercises)) {
					ToastNotification({
						description: i18next.t(
							"error-messages.couldnt-fetch-exercises"
						)
					})
					exercises = []
				}

				let progressions =
					await exercisesService.fetchProgressionsByExercisesIds(
						exercises.map((e) => e.id)
					)
				if (isPostgrestError(progressions)) {
					ToastNotification({
						description: i18next.t(
							"error-messages.couldnt-fetch-progressions"
						)
					})
					progressions = []
				}

				let routines =
					await routinesService.fetchRoutinesWithDaysByUserId(user.id)
				if (isPostgrestError(routines)) {
					ToastNotification({
						description: i18next.t(
							"error-messages.couldnt-fetch-routines"
						)
					})
					routines = []
				}

				const exercisesAndProgressions: ExerciseAndProgressions[] =
					exercises.map((e) => ({
						exercise: e,
						progressions: progressions.filter(
							(p) => p.exercise_id === e.id
						)
					}))

				loadUser(user)
				loadExercisesAndProgressions(exercisesAndProgressions)
				loadRoutines(routines)

				return { user, exercises: exercisesAndProgressions, routines }
			}
		})
	}

	return {
		getUserByUuid,
		getAndUpdateInitialDataByUuid
	}
}
