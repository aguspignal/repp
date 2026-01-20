import { Database } from "./supabase"
import { DatabaseProgression, ExerciseWithProgressions } from "./exercises"

export type DatabaseWorkout = Database["public"]["Tables"]["Workouts"]["Row"]

export type DatabaseWorkoutSet =
	Database["public"]["Tables"]["WorkoutSets"]["Row"]

export type DraftWorkout = Omit<DatabaseWorkout, "id" | "created_at">

export type DraftWorkoutSet = Omit<
	DatabaseWorkoutSet,
	"id" | "progression_id" | "workout_id" | "created_at"
> & {
	progression_id: number | null
}

export type ExerciseIdWithDraftSets = {
	exerciseId: number
	sets: DraftWorkoutSet[]
}

export type WorkoutWithSets = {
	workout: DatabaseWorkout
	sets: DatabaseWorkoutSet[]
}

export type WorkoutSetsAndProgressions = {
	workout: DatabaseWorkout
	sets: DatabaseWorkoutSet[]
	progressions: DatabaseProgression[]
}

export type ExerciseWithProgressionsAndSets = ExerciseWithProgressions & {
	sets: DatabaseWorkoutSet[]
}

export type WorkoutUpdatePayload = {
	draftWorkout: DraftWorkout
	upsertSets: DatabaseWorkoutSet[]
	insertSets: DraftWorkoutSet[]
	deleteSets: DatabaseWorkoutSet[]
}

export type WorkoutHistorySortBy = "newest" | "oldest"
export type WorkoutHistoryViewPer = "sets" | "progressions"
