import { DatabaseExercise } from "../types/exercises"
import { DatabaseUser } from "../types/user"
import { isPostgrestError } from "../utils/queriesHelpers"
import { PostgrestError } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import { useUserStore } from "../stores/useUserStore"
import exercisesService from "../services/exercisesService"
import i18next from "i18next"
import ToastNotification from "../components/notifications/ToastNotification"
import userService from "../services/userService"

const RQKEY_ROOT = "user"
export const GETUSERBYUUID_KEY = (uuid: string) => [RQKEY_ROOT, "getbyuuid", uuid]
export const GETANDUPDATEINITIALDATABYUUID_KEY = (uuid: string) => [RQKEY_ROOT, "initialDataByUuid", uuid]

export default function useUserQuery() {
    const { loadUser, loadExercises } = useUserStore()

    function getUserByUuid(uuid: string | undefined) {
		return useQuery<DatabaseUser | null | PostgrestError>({
			queryKey: GETUSERBYUUID_KEY(uuid ?? ""),
			queryFn: async () => {
				if (!uuid) return null
				return await userService.fetchUserByUuid(uuid)
			},
		})
	}
    
    function getAndUpdateInitialDataByUuid(uuid: string | undefined) {
        return useQuery<{user: DatabaseUser | null, exercises: DatabaseExercise[]}>({
            queryKey: GETANDUPDATEINITIALDATABYUUID_KEY(uuid ?? ''),
            queryFn: async () => {
                if (!uuid) return {user: null, exercises: []}
                
                const user = await userService.fetchUserByUuid(uuid)
                if (!user || isPostgrestError(user))
					throw new Error(i18next.t("error-messages.user-not-found"))

                let exercises = await exercisesService.getExercisesByUserId(user.id)
                if (isPostgrestError(exercises)) {
                    ToastNotification({description: i18next.t('error-messages.couldnt-fetch-exercises')})
                    exercises = []
                }
                
                loadUser(user)
                loadExercises(exercises)

                return {user, exercises}
            },
        })
    }

    return {
        getUserByUuid,
        getAndUpdateInitialDataByUuid
    }
}