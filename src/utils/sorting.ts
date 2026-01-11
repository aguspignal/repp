import { DatabaseProgression } from "../types/exercises"
import { DatabaseRoutineDayExercise, DraftWorkoutSet } from "../types/routines"

export function sortProgressionsByOrderDesc(
	progressions: DatabaseProgression[]
): DatabaseProgression[] {
	return progressions.sort((a, b) => b.order - a.order)
}

export function sortDraftWorkoutSetsByOrderAsc(
	sets: DraftWorkoutSet[]
): DraftWorkoutSet[] {
	return sets.sort((a, b) => a.order - b.order)
}

export function sortRDExercisesByOrderAsc(
	exercises: DatabaseRoutineDayExercise[]
): DatabaseRoutineDayExercise[] {
	return exercises.sort((a, b) => a.order - b.order)
}
