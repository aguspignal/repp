import { Database } from "./supabase"

export type DatabaseRoutine = Database["public"]["Tables"]["Routines"]["Row"]

export type DatabaseRoutineDay =
	Database["public"]["Tables"]["RoutineDays"]["Row"]

export type DatabaseRoutineDayExercise =
	Database["public"]["Tables"]["RoutineDayExercises"]["Row"]

export type DatabaseWorkout = Database["public"]["Tables"]["Workouts"]["Row"]

export type DatabaseWorkoutSet =
	Database["public"]["Tables"]["WorkoutSets"]["Row"]

export type RoutineStatus = Database["public"]["Enums"]["RoutineStatus"]

export type RoutineWithDays = {
	routine: DatabaseRoutine
	days: DatabaseRoutineDay[]
}

export type RoutineWithDaysAndExercises = {
	routine: DatabaseRoutine
	daysAndExercises: RoutineDayAndExercises[]
}

export type RoutineDayAndExercises = {
	day: DatabaseRoutineDay
	exercises: DatabaseRoutineDayExercise[]
}

export type DraftRoutineDayExercise = Omit<
	DatabaseRoutineDayExercise,
	"id" | "routineday_id" | "created_at"
>

export type DraftWorkoutSet = {
	order: number
	progressionId: number | null
	reps: number | null
}

export type ExercisesSets = {
	exerciseId: number
	sets: DraftWorkoutSet[]
}

export type WorkoutAndSets = {
	workout: DatabaseWorkout
	sets: DatabaseWorkoutSet[]
}

export type RDEGoals = Pick<
	DatabaseRoutineDayExercise,
	"set_goal_low" | "set_goal_high" | "rep_goal_low" | "rep_goal_high"
>

export type RDEGoalType = "setsHigh" | "setsLow" | "repsHigh" | "repsLow"
