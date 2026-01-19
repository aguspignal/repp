import { DatabaseProgression } from "../types/exercises"
import { DraftWorkoutExerciseSets } from "../types/routines"

export function areDraftWorkoutExerciseSetsInvalid(
	workoutSets: DraftWorkoutExerciseSets[]
): boolean {
	const emptyProgressions = workoutSets.some((es) =>
		es.sets.some((s) => !s.progressionId || s.progressionId < 0)
	)

	const noProgressions = workoutSets.every((es) =>
		es.sets.every((s) => !s.progressionId)
	)

	return emptyProgressions || noProgressions
}

export function areProgressionsValid(
	progressions: DatabaseProgression[]
): boolean {
	return progressions.some((p) => p.name.length === 0 || !p.name)
}
