import { Database } from "./supabase"

export type DatabaseRoutine = Database["public"]["Tables"]["Routines"]["Row"]

export type DatabaseRoutineDay =
	Database["public"]["Tables"]["RoutineDays"]["Row"]

export type DatabaseRoutineDayExercise =
	Database["public"]["Tables"]["RoutineDayExercises"]["Row"]

export type DatabaseSchedule =
	Database["public"]["Tables"]["RoutineSchedules"]["Row"]

export type RoutineStatus = Database["public"]["Enums"]["RoutineStatus"]

export type DraftRoutineDayExercise = Omit<
	DatabaseRoutineDayExercise,
	"id" | "routineday_id" | "created_at"
>

export type RoutineDayExerciseGoals = Pick<
	DatabaseRoutineDayExercise,
	"set_goal_low" | "set_goal_high" | "rep_goal_low" | "rep_goal_high"
>

export type RoutineWithDays = {
	routine: DatabaseRoutine
	days: DatabaseRoutineDay[]
}

export type RoutineDayWithExercises = {
	day: DatabaseRoutineDay
	exercises: DatabaseRoutineDayExercise[]
}

export type RoutineWithDaysAndExercises = {
	routine: DatabaseRoutine
	daysAndExercises: RoutineDayWithExercises[]
}

export type RoutineDayExerciseGoalType =
	| "setsHigh"
	| "setsLow"
	| "repsHigh"
	| "repsLow"
