import { Database } from "./supabase"

export type DatabaseRoutine = Database["public"]["Tables"]["Routines"]["Row"]

export type DatabaseRoutineDay =
	Database["public"]["Tables"]["RoutineDays"]["Row"]

export type DatabaseRoutineDayExercise =
	Database["public"]["Tables"]["RoutineDayExercises"]["Row"]

export type RoutineStatus = Database["public"]["Enums"]["RoutineStatus"]

export type RoutineAndDays = {
	routine: DatabaseRoutine
	days: DatabaseRoutineDay[]
}

export type RoutineDayAndExercises = {
	day: DatabaseRoutineDay
	exercises: DatabaseRoutineDayExercise[]
}

export type DraftRoutineDayExercise = {
	exerciseId: number
	order: number
	setsGoalLow: number | null
	setsGoalHigh: number | null
	repsGoalLow: number | null
	repsGoalHigh: number | null
}
