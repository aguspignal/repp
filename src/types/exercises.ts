import { Database } from "./supabase"

export type DatabaseExercise = Database["public"]["Tables"]["Exercises"]["Row"]

export type DatabaseProgression =
	Database["public"]["Tables"]["Progressions"]["Row"]

export type DraftProgression = Omit<
	DatabaseProgression,
	"id" | "exercise_id" | "created_at"
>

export type DraftExercise = Omit<
	DatabaseExercise,
	"id" | "user_id" | "created_at"
>

export type DraftExerciseAndProgression = {
	draftExercise: DraftExercise
	upsertProgressions: DatabaseProgression[]
	insertProgressions: DraftProgression[]
	deleteProgressionsFromOrder: number | null
}

export type ExerciseAndProgressions = {
	exercise: DatabaseExercise
	progressions: DatabaseProgression[]
}

export type ExerciseSortBy = "ascending" | "descending" | "type"
export type ExerciseFilterBy = "all" | "bodyweight" | "freeweight" | "isometric"
