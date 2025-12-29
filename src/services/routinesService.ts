import { DatabaseRoutine, RoutineAndDays } from "../types/routines"
import { PostgrestError } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

const routinesService = {
	async getRoutineWithDaysById(
		id: number
	): Promise<RoutineAndDays | null | PostgrestError> {
		console.log("R-SERVICE: getRoutineWithDaysById")
		const { error, data } = await supabase
			.from("Routines")
			.select("*, days:RoutineDays(*)")
			.eq("id", id)

		if (error) return error
		const { days, ...routine } = data[0]
		return { routine, days }
	},

	async getRoutinesWithDaysByUserId(
		userId: number
	): Promise<RoutineAndDays[] | PostgrestError> {
		console.log("R-SERVICE: getRoutinesWithDaysByUserId")
		const { error, data } = await supabase
			.from("Routines")
			.select("*, days:RoutineDays(*)")
			.eq("user_id", userId)

		if (error) return error
		return data.map((row) => {
			const { days, ...routine } = row
			return { routine, days }
		})
	},

	async postRoutine({
		userId,
		name,
		description
	}: PostRoutineParams): Promise<DatabaseRoutine | null | PostgrestError> {
		console.log("R-SERVICE: postRoutine")
		const { error, data } = await supabase
			.from("Routines")
			.insert({ user_id: userId, name, description, status: "draft" })
			.select()

		if (error) return error
		return data[0]
	}
}

export default routinesService

export type PostRoutineParams = {
	userId: number
	name: string
	description: string | null
}
