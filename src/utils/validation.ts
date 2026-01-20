import { DatabaseProgression } from "../types/exercises"
import { ExerciseIdWithDraftSets } from "../types/workouts"

export function areDraftWorkoutExerciseSetsInvalid(
	workoutSets: ExerciseIdWithDraftSets[]
): boolean {
	const emptyProgressions = workoutSets.some((es) =>
		es.sets.some((s) => !s.progression_id || s.progression_id < 0)
	)

	const noProgressions = workoutSets.every((es) =>
		es.sets.every((s) => !s.progression_id)
	)

	return emptyProgressions || noProgressions
}

export function areProgressionsValid(
	progressions: DatabaseProgression[]
): boolean {
	return progressions.some((p) => p.name.length === 0 || !p.name)
}
