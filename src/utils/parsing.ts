import {
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise,
	DraftWorkoutExerciseSets,
	DraftWorkoutSet,
	RDEGoals,
	WorkoutAndSets,
	WorkoutHistorySortBy,
	WorkoutHistoryViewPer
} from "../types/routines"
import {
	ExerciseAndProgressions,
	ExerciseFilterBy,
	ExerciseSortBy
} from "../types/exercises"
import { Dispatch, SetStateAction } from "react"
import i18next from "i18next"

export function parseExerciseSortByToText(sortBy: ExerciseSortBy): string {
	if (sortBy === "ascending") return "A-Z"
	else if (sortBy === "descending") return "Z-A"
	else return i18next.t("attributes.type")
}

export function parseExerciseFilterByToText(
	filterBy: ExerciseFilterBy
): string {
	if (filterBy === "all") return i18next.t("attributes.all")
	else if (filterBy === "bodyweight")
		return i18next.t("attributes.bodyweight")
	else if (filterBy === "freeweight")
		return i18next.t("attributes.freeweight")
	else return i18next.t("attributes.isometric")
}

export function parseWorkoutHistorySortByToText(
	sortBy: WorkoutHistorySortBy
): string {
	if (sortBy === "newest") return i18next.t("messages.newest-first")
	else return i18next.t("messages.oldest-first")
}

export function parseWorkoutHistoryViewPerToText(
	viewPer: WorkoutHistoryViewPer
): string {
	if (viewPer === "progressions")
		return i18next.t("messages.per-progressions")
	else return i18next.t("messages.per-set")
}

function divideArrayInGroups(array: any[], groupSize: number): any[] {
	let groups = []
	for (let i = 0; i < array.length; i += groupSize) {
		groups.push(array.slice(i, i + groupSize))
	}
	return groups
}

export function divideRoutineDayInGroups(
	days: DatabaseRoutineDay[]
): DatabaseRoutineDay[][] {
	const groupSize = days.length === 4 ? 2 : 3
	return divideArrayInGroups(days, groupSize) as DatabaseRoutineDay[][]
}

export function parseDateToWeekdayMonthDay(date: Date): string {
	return date.toLocaleDateString("en-US", {
		weekday: "short",
		month: "long",
		day: "numeric"
	})
}

export function parseNumericInput(
	txt: string,
	setState: Dispatch<SetStateAction<string>>
): number | null {
	const clean = txt.replace(/[^0-9]/g, "")
	setState(clean)

	if (clean === "" || isNaN(Number(clean))) return null
	return Number(clean)
}

export function parseGoalsToText(
	goals: RDEGoals,
	inSeconds?: boolean,
	hideGoalText?: boolean
): string | null {
	if (!goals.rep_goal_low && !goals.set_goal_low) return null

	const goalStr: string = hideGoalText
		? ""
		: `${i18next.t("attributes.goal")}: `

	const setsStr = goals.set_goal_high
		? `${goals.set_goal_low}-${goals.set_goal_high}`
		: `${goals.set_goal_low}`

	if (!goals.rep_goal_low && goals.set_goal_low) {
		return `${goalStr}${setsStr} ${i18next.t("attributes.sets")}`
	}

	const repsStr = goals.rep_goal_high
		? `${goals.rep_goal_low}-${goals.rep_goal_high}`
		: `${goals.rep_goal_low}`

	if (goals.rep_goal_low && !goals.set_goal_low) {
		return `${goalStr}${repsStr} ${
			inSeconds
				? i18next.t("attributes.seconds")
				: i18next.t("attributes.reps")
		}`
	}

	return `${goalStr}${setsStr}x${repsStr}`
}

export function mapWorkoutAndSetsToDraftWorkoutExerciseSets(
	routineDayExercises: DatabaseRoutineDayExercise[],
	exercises: ExerciseAndProgressions[],
	workoutData: WorkoutAndSets | null
): DraftWorkoutExerciseSets[] {
	return routineDayExercises.map((de) => {
		const thisExercise = exercises.find(
			(e) => e.exercise.id === de.exercise_id
		)

		const sets: DraftWorkoutSet[] = !workoutData
			? [{ order: 1, progressionId: null, reps: null }]
			: workoutData.sets
					.filter((s) =>
						thisExercise?.progressions.some(
							(p) => p.id === s.progression_id
						)
					)
					.map((s) => ({
						id: s.id,
						order: s.order,
						progressionId: s.progression_id,
						reps: s.reps
					}))

		return {
			exerciseId: de.exercise_id,
			sets
		}
	})
}

export function mapWorkoutDataToDraftWorkoutExerciseSets(
	workoutData: WorkoutAndSets,
	exercises: ExerciseAndProgressions[]
): DraftWorkoutExerciseSets[] {
	const workoutExercises: ExerciseAndProgressions[] = exercises.flatMap(
		(ep) =>
			workoutData.sets.some((set) =>
				ep.progressions.some((p) => p.id === set.progression_id)
			)
				? ep
				: []
	)

	return workoutExercises.map((ep) => ({
		exerciseId: ep.exercise.id,
		sets: workoutData.sets
			.filter((set) =>
				ep.progressions.some((p) => p.id === set.progression_id)
			)
			.map((set) => ({
				order: set.order,
				progressionId: set.progression_id,
				reps: set.reps
			}))
	}))
}
