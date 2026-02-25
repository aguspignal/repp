import {
	DatabaseRoutine,
	DatabaseRoutineDay,
	RoutineWithDaysAndSchedule
} from "../types/routines"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { DatabaseUser } from "../types/user"
import {
	DatabaseExercise,
	DatabaseProgression,
	ExerciseWithProgressions
} from "../types/exercises"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { sortProgressionsByOrderDesc } from "../utils/sorting"

interface UserState {
	user: DatabaseUser | null
	exercises: ExerciseWithProgressions[]
	routines: RoutineWithDaysAndSchedule[]

	loadUser: (u: DatabaseUser | null) => void
	loadExercisesAndProgressions: (eps: ExerciseWithProgressions[]) => void
	loadRoutines: (rs: RoutineWithDaysAndSchedule[]) => void
	getRoutineByDayId: (dId: number) => DatabaseRoutine

	addExercise: (ep: ExerciseWithProgressions) => void
	updateExerciseAndProgressions: (
		e: DatabaseExercise,
		updatedProgressions: DatabaseProgression[],
		insertedProgressions: DatabaseProgression[],
		deleteFromOrder: number | undefined
	) => void
	addRoutineWithDaysAndSchedule: (r: RoutineWithDaysAndSchedule) => void
	addRoutineDay: (rd: DatabaseRoutineDay) => void
	updateRoutine: (r: DatabaseRoutine) => void

	removeExercise: (eId: number) => void
	removeRoutine: (rId: number) => void
	removeRoutineDay: (rId: number, dId: number) => void

	clearUserStore: () => void
	markActiveRoutinesAsDraft: () => void
}

export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({
			user: null,
			exercises: [],
			routines: [],

			loadUser: (u) => set({ user: u }),
			loadExercisesAndProgressions: (eps) => set({ exercises: eps }),
			loadRoutines: (rs) => set({ routines: rs }),
			getRoutineByDayId: (dId) => {
				return get().routines.filter((r) =>
					r.days.find((d) => d.id === dId)
				)[0].routine
			},
			addExercise: (ep) =>
				set({
					exercises: get()
						.exercises.filter(
							(e) => e.exercise.id !== ep.exercise.id
						)
						.concat(ep)
				}),
			updateExerciseAndProgressions: (
				exercise,
				updatedProgressions,
				insertedProgressions,
				deleteFromOrder
			) =>
				set({
					exercises: get().exercises.map((e) => {
						if (e.exercise.id !== exercise.id) return e

						const mergedIds = new Set([
							...updatedProgressions.map((p) => p.id),
							...insertedProgressions.map((p) => p.id)
						])

						const filteredProgressions = e.progressions.filter(
							(p) =>
								p.order <
									(deleteFromOrder ??
										Number.POSITIVE_INFINITY) &&
								!mergedIds.has(p.id)
						)
						return {
							exercise,
							progressions: sortProgressionsByOrderDesc([
								...filteredProgressions,
								...insertedProgressions,
								...updatedProgressions
							])
						}
					})
				}),
			addRoutineWithDaysAndSchedule: (routine) =>
				set({
					routines: get()
						.routines.filter(
							(r) => r.routine.id !== routine.routine.id
						)
						.concat(routine)
				}),
			updateRoutine: (routine) => {
				const days = get().routines.filter(
					(r) => r.routine.id === routine.id
				)[0].days
				set({
					routines: get()
						.routines.filter((r) => r.routine.id !== routine.id)
						.concat({ routine, days })
				})
			},
			addRoutineDay: (rd) =>
				set({
					routines: get().routines.map((routine) => {
						return routine.routine.id !== rd.routine_id
							? routine
							: {
									routine: routine.routine,
									days: routine.days
										.filter((d) => d.id !== rd.id)
										.concat(rd)
								}
					})
				}),

			removeExercise: (eId) =>
				set({
					exercises: get().exercises.filter(
						(e) => e.exercise.id !== eId
					)
				}),
			removeRoutine: (rId) =>
				set({
					routines: get().routines.filter((r) => r.routine.id !== rId)
				}),
			removeRoutineDay: (rId, dId) => {
				const routine = get().routines.filter(
					(r) => r.routine.id === rId
				)[0]
				const days = routine.days.filter((d) => d.id === dId)
				const routineAndDay: RoutineWithDaysAndSchedule = {
					routine: routine.routine,
					days
				}
				set({
					routines: get()
						.routines.filter((r) => r.routine.id === rId)
						.concat(routineAndDay)
				})
			},
			clearUserStore: () => set({ user: null, exercises: [] }),
			markActiveRoutinesAsDraft: () =>
				set({
					routines: get().routines.map((r) => {
						if (r.routine.status !== "active") return r
						return {
							days: r.days,
							routine: {
								...r.routine,
								status: "draft"
							}
						}
					})
				})
		}),
		{
			name: "user-store",
			storage: createJSONStorage(() => AsyncStorage)
		}
	)
)
