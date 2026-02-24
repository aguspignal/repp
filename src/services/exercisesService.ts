import {
	DatabaseExercise,
	DatabaseProgression,
	DraftProgression
} from "../types/exercises"
import { PostgrestError } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { ExerciseHistorySet } from "../types/workouts"

const exercisesService = {
	async fetchExerciseById(
		id: number
	): Promise<DatabaseExercise | null | PostgrestError> {
		console.log("E-SERVICE: fetchExerciseById")
		const { error, data } = await supabase
			.from("Exercises")
			.select("*")
			.eq("id", id)

		if (error) return error
		return data[0] ?? null
	},

	async fetchExercisesByUserId(
		uId: number
	): Promise<DatabaseExercise[] | PostgrestError> {
		console.log("E-SERVICE: fetchExercisesByUserId")
		const { error, data } = await supabase
			.from("Exercises")
			.select("*")
			.eq("user_id", uId)

		if (error) return error
		return data
	},

	async fetchProgressionsByExercisesIds(
		eIds: number[]
	): Promise<DatabaseProgression[] | PostgrestError> {
		console.log("E-SERVICE: fetchProgressionsByExerciseId")
		const { error, data } = await supabase
			.from("Progressions")
			.select("*")
			.in("exercise_id", eIds)

		if (error) return error
		return data
	},

	async fetchExerciseHistory({
		exerciseId,
		fromDate,
		toDate,
		highestProgressionOrder,
		lowestProgressionOrder
	}: FetchExerciseHistoryParams): Promise<
		ExerciseHistorySet[] | PostgrestError
	> {
		console.log("E-SERVICE: fetchExerciseHistory")
		const { data, error } = await supabase.rpc(
			"get_exercise_workout_sets",
			{
				exercise_id: exerciseId,
				from_date: fromDate.toISOString(),
				to_date: toDate.toISOString(),
				highest_prog_order: highestProgressionOrder,
				lowest_prog_order: lowestProgressionOrder
			}
		)

		if (error) return error
		return data
	},

	async postExercise({
		userId,
		name,
		description,
		isBodyweight,
		isFreeweight,
		isIsometric
	}: PostExerciseParams): Promise<DatabaseExercise | null | PostgrestError> {
		console.log("E-SERVICE: postExercise")
		const { error, data } = await supabase
			.from("Exercises")
			.insert({
				user_id: userId,
				name,
				description,
				is_bodyweight: isBodyweight,
				is_freeweight: isFreeweight,
				is_isometric: isIsometric
			})
			.select()

		if (error) return error
		return data[0] ?? null
	},

	async postProgressionsBulk({
		exerciseId,
		progressions
	}: PostProgressionsBulkParams): Promise<
		DatabaseProgression[] | PostgrestError
	> {
		console.log("E-SERVICE: postProgressionsBulk")
		const { error, data } = await supabase
			.from("Progressions")
			.insert(
				progressions.map((p) => ({
					...p,
					exercise_id: exerciseId,
					created_at: new Date(Date.now()).toISOString()
				}))
			)
			.select()

		if (error) return error
		return data
	},

	async updateExercise(
		exercise: DatabaseExercise
	): Promise<DatabaseExercise | null | PostgrestError> {
		console.log("E-SERVICE: updateExercise")
		const { error, data } = await supabase
			.from("Exercises")
			.update(exercise)
			.eq("id", exercise.id)
			.select()

		if (error) return error
		return data[0] ?? null
	},

	async upsertProgressions({
		progressions
	}: UpsertProgressionsParams): Promise<
		DatabaseProgression[] | PostgrestError
	> {
		console.log("E-SERVICE: upsertProgressions")
		const { error, data } = await supabase
			.from("Progressions")
			.upsert(progressions)
			.select()

		if (error) return error
		return data
	},

	async deleteExerciseAndProgressions(
		exerciseId: number
	): Promise<number | PostgrestError> {
		console.log("E-SERVICE: deleteExerciseAndProgressions")
		const { error: progressionsError } = await supabase
			.from("Progressions")
			.delete({ count: "exact" })
			.eq("exercise_id", exerciseId)

		if (progressionsError) return progressionsError

		const { error, count } = await supabase
			.from("Exercises")
			.delete({ count: "exact" })
			.eq("id", exerciseId)

		if (error) return error
		return count ?? 0
	},

	async deleteProgressionsFromOrder({
		exerciseId,
		order
	}: deleteProgressionsFromOrderParams): Promise<number | PostgrestError> {
		console.log("E-SERVICE: deleteProgressionsFromOrder")
		const { error, count } = await supabase
			.from("Progressions")
			.delete({ count: "exact" })
			.gte('"order"', order)
			.eq("exercise_id", exerciseId)

		if (error) return error
		return count ?? 0
	}
}

export default exercisesService

export type PostExerciseParams = {
	userId: number
	name: string
	description: string
	isBodyweight: boolean
	isFreeweight: boolean
	isIsometric: boolean
}

export type UpdateExerciseParams = {
	id: number
	name: string
	description: string
	isBodyweight: boolean
	isFreeweight: boolean
	isIsometric: boolean
}

type PostProgressionsBulkParams = {
	exerciseId: number
	progressions: DraftProgression[]
}

type deleteProgressionsFromOrderParams = {
	exerciseId: number
	order: number
}

type UpsertProgressionsParams = {
	progressions: DatabaseProgression[]
}

export type FetchExerciseHistoryParams = {
	exerciseId: number
	highestProgressionOrder: number
	lowestProgressionOrder: number
	fromDate: Date
	toDate: Date
}
