import {
	DatabaseRoutine,
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise,
	DraftRoutineDayExercise,
	RoutineWithDays,
	RoutineDayAndExercises,
	RoutineWithDaysAndExercises,
	DatabaseWorkout,
	DatabaseWorkoutSet,
	DraftWorkoutSet
} from "../types/routines"
import { isPostgrestError } from "../utils/queriesHelpers"
import { PostgrestError } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

const routinesService = {
	async getRoutineById(
		id: number
	): Promise<DatabaseRoutine | null | PostgrestError> {
		console.log("R-SERVICE: getRoutineById")
		const { error, data } = await supabase
			.from("Routines")
			.select("*")
			.eq("id", id)

		if (error) return error
		return data[0]
	},

	async getRoutineWithDaysAndExercisesById(
		id: number
	): Promise<RoutineWithDaysAndExercises | null | PostgrestError> {
		console.log("R-SERVICE: getRoutineWithDaysAndExercisesById")
		const { error, data } = await supabase
			.from("Routines")
			.select("*, days:RoutineDays(*, exercises:RoutineDayExercises(*))")
			.eq("id", id)

		if (error) return error
		const { days, ...routine } = data[0]
		return {
			routine,
			daysAndExercises: days.map((d) => {
				const { exercises, ...day } = d
				return { day, exercises }
			})
		}
	},

	async getRoutinesWithDaysByUserId(
		userId: number
	): Promise<RoutineWithDays[] | PostgrestError> {
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

	async countRoutineDayWorkouts(
		dayId: number
	): Promise<number | PostgrestError> {
		console.log("R-SERVICE: countRoutineDayWorkouts")
		const { error, count } = await supabase
			.from("Workouts")
			.select("", { count: "exact" })
			.eq("routineday_id", dayId)

		if (error) return error
		return count ?? 0
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
	}: PostRoutineExercisesParamas): Promise<
		DatabaseRoutineDayExercise[] | PostgrestError
	> {
		console.log("R-SERVICE: postRoutineDayExercisesBulk")
		const { error, data } = await supabase
			.from("RoutineDayExercises")
			.insert(
				exercises.map((e) => ({
					...e,
					routineday_id: routineDayId
				}))
			)
			.select()

		if (error) return error
		return data
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
					.filter((ds) => ds.progressionId && ds.progressionId > 0)
					.map((ds) => ({
						workout_id: workoutId,
						progression_id: ds.progressionId!,
						order: ds.order,
						reps: ds.reps ?? 0
					}))
			)
			.select()

		console.log(error)
		if (error) return error
		return data
	},

	async updateRoutine(
		routine: DatabaseRoutine
	): Promise<DatabaseRoutine | null | PostgrestError> {
		console.log("R-SERVICE: updateRoutine")
		const { error, data } = await supabase
			.from("Routines")
			.update(routine)
			.eq("id", routine.id)
			.select()

		if (error) return error
		return data[0]
	},

	async updateUserActiveRoutinesAsDraft(
		userId: number
	): Promise<number | PostgrestError> {
		console.log("R-SERVICE: updateActiveRoutinesAsDraft")
		const { error, count } = await supabase
			.from("Routines")
			.update({ status: "draft" }, { count: "exact" })
			.eq("user_id", userId)
			.eq("status", "active")

		if (error) return error
		return count ?? 0
	},

	async updateRoutineAsActive(
		routineId: number
	): Promise<number | PostgrestError> {
		console.log("R-SERVICE: updateRoutineAsActive")
		const { error, count } = await supabase
			.from("Routines")
			.update({ status: "active" }, { count: "exact" })
			.eq("id", routineId)

		if (error) return error
		return count ?? 0
	},

	async updateRoutineDay(
		day: DatabaseRoutineDay
	): Promise<DatabaseRoutineDay | null | PostgrestError> {
		console.log("R-SERVICE: updateRoutineDay")
		const { error, data } = await supabase
			.from("RoutineDays")
			.update(day)
			.eq("id", day.id)
			.select()

		if (error) return error
		return data[0]
	},

	async upsertRoutineDayExercises(
		exercises: DatabaseRoutineDayExercise[]
	): Promise<number | PostgrestError> {
		console.log("R-SERVICE: upsertRoutineDayExercises")
		const { error, count } = await supabase
			.from("RoutineDayExercises")
			.upsert(exercises, { count: "exact" })

		if (error) return error
		return count ?? 0
	},

	async deleteRoutineDay(id: number): Promise<number | PostgrestError> {
		console.log("R-SERVICE: deleteRoutinDay")

		const workoutsCount = await this.countRoutineDayWorkouts(id)
		if (isPostgrestError(workoutsCount)) return workoutsCount

		if (workoutsCount > 0) {
			const { error, count } = await supabase
				.from("RoutineDays")
				.update({ deleted: true }, { count: "exact" })
				.eq("id", id)

			if (error) return error
			return count ?? 0
		}

		const { error, count } = await supabase
			.from("RoutineDays")
			.delete({ count: "exact" })
			.eq("id", id)

		if (error) return error
		return count ?? 0
	},

	async deleteRoutineDayExercisesByIds(
		rdeIds: number[]
	): Promise<number | PostgrestError> {
		console.log("R-SERVICE: deleteRoutineDayExercises")
		console.log("del rdeIds: ", rdeIds)
		const { error, count } = await supabase
			.from("RoutineDayExercises")
			.delete({ count: "exact" })
			.in("exercise_id", rdeIds)

		if (error) return error
		console.log("del count: ", count)
		return count ?? 0
	},

	async deleteAllRoutineDayExercises(
		dayId: number
	): Promise<number | PostgrestError> {
		console.log("R-SERVICE: deleteRoutineDayExercises")
		const { error, count } = await supabase
			.from("RoutineDayExercises")
			.delete({ count: "exact" })
			.eq("routineday_id", dayId)

		if (error) return error
		return count ?? 0
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
	exercises: DraftRoutineDayExercise[]
}

export type UpdateRoutineDayParams = {
	id: number
	name: string
	code: string
}

export type UpdateUserRoutineStatusParams = {
	userId: number
	routineId: number
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
