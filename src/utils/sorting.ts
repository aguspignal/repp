import {
	DatabaseRoutineDayExercise,
	DraftWorkoutSet,
	RoutineDayAndExercises,
	WorkoutAndSets,
	WorkoutHistorySortBy
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

export function sortWorkoutsByDate(
	workoutsAndSets: WorkoutAndSets[],
	sortBy: WorkoutHistorySortBy
): WorkoutAndSets[] {
	return workoutsAndSets.sort((a, b) =>
		sortBy === "newest"
			? a.workout.date.localeCompare(b.workout.date)
			: -1 * a.workout.date.localeCompare(b.workout.date)
	)
}
