import {
	DatabaseWorkout,
	DatabaseWorkoutSet,
	DraftWorkoutSet,
	WorkoutWithSets
} from "../types/workouts"
import { PostgrestError } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

const workoutsService = {
	async fetchWorkoutAndSetsById(
		wId: number
	): Promise<WorkoutWithSets | null | PostgrestError> {
		console.log("R-SERVICE: fetchWorkoutAndSets")
		const { error, data: workout } = await supabase
			.from("Workouts")
			.select("*")
			.eq("id", wId)

		if (error) return error

		const { error: setsError, data: sets } = await supabase
			.from("WorkoutSets")
			.select("*")
			.eq("workout_id", wId)

		if (setsError) return setsError
		return {
			workout: workout[0],
			sets
		}
	},

	async fetchWorkoutsAndSetsInRangeByDayId({
		dayId,
		rangeFrom,
		rangeTo
	}: GetWorkoutsAndSetsInRangeByDayIdParams): Promise<
		WorkoutWithSets[] | PostgrestError
	> {
		console.log("R-SERVICE: fetchWorkoutsAndSetsInRangeByDayId")
		const { error, data: workouts } = await supabase
			.from("Workouts")
			.select("*")
			.eq("routineday_id", dayId)
			.order("created_at", { ascending: false })
			.range(rangeFrom, rangeTo)

		if (error) return error

		const { error: setsError, data: sets } = await supabase
			.from("WorkoutSets")
			.select("*")
			.in(
				"workout_id",
				workouts.map((w) => w.id)
			)

		if (setsError) return setsError

		return workouts.map((w) => {
			const workoutSets = sets.filter((s) => s.workout_id === w.id)
			return { workout: w, sets: workoutSets }
		})
	},

	async countRoutineDayAllTimeWorkouts(
		id: number
	): Promise<number | PostgrestError> {
		console.log("-SERVICE: getRoutineDayAllTimeWorkoutsCount")
		const { error, count } = await supabase
			.from("Workouts")
			.select("*", { count: "exact", head: true })
			.eq("routineday_id", id)

		if (error) return error
		return count ?? 0
	},

	async postWorkout({
		routineDayId,
		date,
		note
	}: PostWorkoutParams): Promise<DatabaseWorkout | null | PostgrestError> {
		console.log("R-SERVICE: postWorkout")
		const { error, data } = await supabase
			.from("Workouts")
			.insert({ routineday_id: routineDayId, date, note })
			.select()

		if (error) return error
		return data[0]
	},

	async postWorkoutSetsBulk({
		draftSets,
		workoutId
	}: PostWorkoutSetsBulkParams): Promise<
		DatabaseWorkoutSet[] | PostgrestError
	> {
		console.log("R-SERVICE: postWorkoutSetsBulk")
		console.log("serv: ", draftSets)

		const { error, data } = await supabase
			.from("WorkoutSets")
			.insert(
				draftSets
					.filter((ds) => ds.progression_id && ds.progression_id > 0)
					.map((ds) => ({
						workout_id: workoutId,
						progression_id: ds.progression_id!,
						order: ds.order,
						reps: ds.reps ?? 0
					}))
			)
			.select()

		console.log(error)
		if (error) return error
		return data
	},

	async updateWorkout(
		workout: DatabaseWorkout
	): Promise<DatabaseWorkout | null | PostgrestError> {
		console.log("R-SERVICE: updateWorkout")
		const { error, data } = await supabase
			.from("Workouts")
			.update(workout)
			.eq("id", workout.id)
			.select()

		if (error) return error
		return data[0]
	},

	async upsertSetsBulk(
		sets: DatabaseWorkoutSet[]
	): Promise<DatabaseWorkoutSet[] | PostgrestError> {
		console.log("R-SERVICE: upsertSetsBulk")
		const { error, data } = await supabase
			.from("WorkoutSets")
			.upsert(sets)
			.select()

		if (error) return error
		return data
	},

	async deleteWorkout(id: number): Promise<number | PostgrestError> {
		console.log("R-SERVICE: deleteAllWorkoutSets")
		const { error, count } = await supabase
			.from("Workouts")
			.delete({ count: "exact" })
			.eq("id", id)
		console.log("err, ", error)
		console.log("count, ", count)
		if (error) return error
		return count ?? 0
	},

	async deleteWorkoutSetsByIds(
		wsIds: number[]
	): Promise<number | PostgrestError> {
		console.log("R-SERVICE: deleteWorkoutSetsByIds")
		const { error, count } = await supabase
			.from("WorkoutSets")
			.delete({ count: "exact" })
			.in("id", wsIds)

		if (error) return error
		return count ?? 0
	},

	async deleteAllWorkoutSets(wId: number): Promise<number | PostgrestError> {
		console.log("R-SERVICE: deleteAllWorkoutSets")
		const { error, count } = await supabase
			.from("WorkoutSets")
			.delete({ count: "exact" })
			.eq("workout_id", wId)

		if (error) return error
		return count ?? 0
	}
}

export default workoutsService

export type GetWorkoutsAndSetsInRangeByDayIdParams = {
	dayId: number
	rangeFrom: number
	rangeTo: number
}

export type PostWorkoutParams = {
	routineDayId: number
	date: string
	note: string | null
}

export type PostWorkoutSetsBulkParams = {
	workoutId: number
	draftSets: DraftWorkoutSet[]
}
