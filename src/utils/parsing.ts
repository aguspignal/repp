import i18next from "i18next"
import { ExerciseFilterBy, ExerciseSortBy } from "../types/exercises"
import { DatabaseRoutineDay } from "../types/routines"

export function parseExerciseSortByToText(sortBy: ExerciseSortBy) {
	if (sortBy === "ascending") return "A-Z"
	else if (sortBy === "descending") return "Z-A"
	else return i18next.t("attributes.type")
}

export function parseExerciseFilterByToText(filterBy: ExerciseFilterBy) {
	if (filterBy === "all") return i18next.t("attributes.all")
	else if (filterBy === "bodyweight")
		return i18next.t("attributes.bodyweight")
	else if (filterBy === "freeweight")
		return i18next.t("attributes.freeweight")
	else return i18next.t("attributes.isometric")
}

function divideArrayInGroups(array: any[], groupSize: number): any[] {
	let groups = []
	for (let i = 0; i < array.length; i += groupSize) {
		groups.push(array.slice(i, i + groupSize))
	}
	return groups
}

export function divideRoutineDayInGroups(
	days: DatabaseRoutineDay[],
	groupSize: number
): DatabaseRoutineDay[][] {
	return divideArrayInGroups(days, groupSize) as DatabaseRoutineDay[][]
}
