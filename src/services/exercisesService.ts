import {
	DatabaseExercise,
	DatabaseProgression,
	DraftProgression
} from "../types/exercises"
import { PostgrestError } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

const exercisesService = {
	async getExerciseById(
		id: number
	): Promise<DatabaseExercise | null | PostgrestError> {
		console.log("E-SERVICE: getExerciseById")
		const { error, data } = await supabase
			.from("Exercises")
			.select("*")
			.eq("id", id)

		if (error) return error
		return data[0]
	},

	async getExercisesByUserId(
		userId: number
	): Promise<DatabaseExercise[] | PostgrestError> {
		console.log("E-SERVICE: getExercisesByUserId")
		const { error, data } = await supabase
			.from("Exercises")
			.select("*")
			.eq("user_id", userId)

		if (error) return error
		return data
	},

	async getProgressionsByExerciseId(
		exerciseId: number
	): Promise<DatabaseProgression[] | PostgrestError> {
		console.log("E-SERVICE: getProgressionsByExerciseId")
		const { error, data } = await supabase
			.from("Progressions")
			.select("*")
			.eq("exercise_id", exerciseId)

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
		return data[0]
	},

	async postProgressionsBulk({
		exerciseId,
		progressions
	}: PostProgressionsBulkParams): Promise<number | PostgrestError> {
		console.log("E-SERVICE: postProgressionsBulk")
		const { error, count } = await supabase.from("Progressions").insert(
			progressions.map((p) => ({
				...p,
				exercise_id: exerciseId,
				created_at: new Date(Date.now()).toISOString()
			})),
			{ count: "exact" }
		)

		if (error) return error
		return count ?? 0
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
		return data[0]
	},

	async upsertProgressions({ progressions }: UpsertProgressionsParams) {
		console.log("E-SERVICE: upsertProgressions")
		const { error, count } = await supabase
			.from("Progressions")
			.upsert(progressions, { count: "exact" })

		if (error) return error
		return count ?? 0
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
	}: deleteProgressionsFromOrderParams) {
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
