import { useMutation } from "@tanstack/react-query"
import { handleOnMutationError } from "../utils/queriesHelpers"
import routinesService, { PostRoutineParams } from "../services/routinesService"

export default function useRoutineMutation() {
	const createRoutineMutation = useMutation({
		mutationFn: async (params: PostRoutineParams) => {
			return await routinesService.postRoutine(params)
		},
		onError: handleOnMutationError
	})

	return {
		createRoutineMutation
	}
}
