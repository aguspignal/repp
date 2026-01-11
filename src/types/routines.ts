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

export type DraftRoutineDayExercise = {
	exerciseId: number
	order: number
	setsGoalLow: number | null
	setsGoalHigh: number | null
	repsGoalLow: number | null
	repsGoalHigh: number | null
}

export type DraftWorkoutSet = {
	order: number
	progressionId: number | undefined
	reps: number | undefined
}

export type ExercisesSets = {
	exerciseId: number
	sets: DraftWorkoutSet[]
}
