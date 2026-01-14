import {
	DatabaseRoutineDayExercise,
	DraftWorkoutSet,
	RoutineDayAndExercises
} from "../types/routines"
import { DatabaseProgression } from "../types/exercises"

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

export function sortRoutineDaysAndExercisesByName(
	days: RoutineDayAndExercises[]
): RoutineDayAndExercises[] {
	return days.sort((a, b) => a.day.name.localeCompare(b.day.name))
}
