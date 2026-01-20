import {
	DatabaseRoutineDayExercise,
	RoutineDayWithExercises
} from "../types/routines"
import {
	DatabaseExercise,
	DatabaseProgression,
	ExerciseSortBy,
	ExerciseWithProgressions
} from "../types/exercises"
import {
	DraftWorkoutSet,
	WorkoutHistorySortBy,
	WorkoutWithSets
} from "../types/workouts"

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

export function sortExercisesAndProgressionsBy(
	exercises: ExerciseWithProgressions[],
	sortBy: ExerciseSortBy
): ExerciseWithProgressions[] {
	return exercises.sort((a, b) => {
		if (sortBy === "type") {
			const weight = (e: DatabaseExercise) =>
				e.is_bodyweight ? 0 : e.is_freeweight ? 1 : 2
			return weight(a.exercise) - weight(b.exercise)
		}

		return sortBy === "ascending"
			? a.exercise.name.localeCompare(b.exercise.name)
			: -1 * a.exercise.name.localeCompare(b.exercise.name)
	})
}

export function sortRDExercisesByOrderAsc(
	exercises: DatabaseRoutineDayExercise[]
): DatabaseRoutineDayExercise[] {
	return exercises.sort((a, b) => a.order - b.order)
}

export function sortRoutineDaysAndExercisesByName(
	days: RoutineDayWithExercises[]
): RoutineDayWithExercises[] {
	return days.sort((a, b) => a.day.name.localeCompare(b.day.name))
}

export function sortWorkoutsByDate(
	workoutsAndSets: WorkoutWithSets[],
	sortBy: WorkoutHistorySortBy
): WorkoutWithSets[] {
	return workoutsAndSets.sort((a, b) =>
		sortBy === "oldest"
			? a.workout.date.localeCompare(b.workout.date)
			: -1 * a.workout.date.localeCompare(b.workout.date)
	)
}
