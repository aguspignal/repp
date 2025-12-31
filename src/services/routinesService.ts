import {
	DatabaseRoutine,
	DatabaseRoutineDay,
	RoutineAndDays,
	RoutineDayAndExercises
} from "../types/routines"
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

	async getRoutineDayAndExercises(
		dayId: number
	): Promise<RoutineDayAndExercises | null | PostgrestError> {
		console.log("R-SERVICE: getRoutineDayExercises")
		const { error, data } = await supabase
			.from("RoutineDays")
			.select("*")
			.eq("id", dayId)

		if (error) return error

		const { error: exercisesError, data: exercises } = await supabase
			.from("RoutineDayExercises")
			.select("*")
			.eq("routineday_id", dayId)

		if (exercisesError) return exercisesError
		return {
			day: data[0],
			exercises
		}
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
	},

	async postRoutineDay({
		routineId,
		name,
		code
	}: PostRoutineDayParams): Promise<
		DatabaseRoutineDay | null | PostgrestError
	> {
		console.log("R-SERVICE: postRoutineDay")
		const { error, data } = await supabase
			.from("RoutineDays")
			.insert({ routine_id: routineId, name, code })
			.select()

		if (error) return error
		return data[0]
	},

	async postRoutineDayExercisesBulk({
		routineDayId,
		exercises
	}: PostRoutineExercisesParamas) {
		console.log("R-SERVICE: postRoutineDayExercisesBulk")
		const { error, data } = await supabase
			.from("RoutineDayExercises")
			.insert(
				exercises.map((ex) => ({
					routineday_id: routineDayId,
					exercise_id: ex.id,
					order: ex.order,
					set_goal_low: ex.setsGoalLow,
					set_goal_high: ex.setsGoalHigh,
					rep_goal_low: ex.repsGoalLow,
					rep_goal_high: ex.repsGoalHigh
				}))
			)
			.select()

		if (error) return error
		return data
	}
}

export default routinesService

export type PostRoutineParams = {
	userId: number
	name: string
	description: string | null
}

export type PostRoutineDayParams = {
	routineId: number
	name: string
	code: string
}

export type PostRoutineExercisesParamas = {
	routineDayId: number
	exercises: {
		id: number
		order: number
		setsGoalLow: number | null
		setsGoalHigh: number | null
		repsGoalLow: number | null
		repsGoalHigh: number | null
	}[]
}
