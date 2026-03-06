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
	ExerciseIdWithDraftSets,
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

export function sortExerciseIdWithDraftSets(
	item: ExerciseIdWithDraftSets
): ExerciseIdWithDraftSets {
	return {
		exerciseId: item.exerciseId,
		sets: [...item.sets].sort(
			(a, b) =>
				a.order - b.order ||
				a.reps - b.reps ||
				(a.progression_id ?? -1) - (b.progression_id ?? -1)
		)
	}
}

export function areExerciseIdWithDraftSetsEqual(
	a: ExerciseIdWithDraftSets,
	b: ExerciseIdWithDraftSets
): boolean {
	if (a.exerciseId !== b.exerciseId) return false
	if (a.sets.length !== b.sets.length) return false

	const sortedA = sortExerciseIdWithDraftSets(a)
	const sortedB = sortExerciseIdWithDraftSets(b)

	return sortedA.sets.every((setA, i) => {
		const setB = sortedB.sets[i]
		return (
			setA.order === setB.order &&
			setA.reps === setB.reps &&
			setA.progression_id === setB.progression_id
		)
	})
}

export function areExerciseIdWithDraftSetsArrayEqual(
	a: ExerciseIdWithDraftSets[],
	b: ExerciseIdWithDraftSets[]
): boolean {
	if (a.length !== b.length) return false

	const sortArray = (arr: ExerciseIdWithDraftSets[]) =>
		[...arr]
			.sort((x, y) => x.exerciseId - y.exerciseId)
			.map(sortExerciseIdWithDraftSets)

	const sortedA = sortArray(a)
	const sortedB = sortArray(b)

	return sortedA.every((itemA, i) =>
		areExerciseIdWithDraftSetsEqual(itemA, sortedB[i])
	)
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
