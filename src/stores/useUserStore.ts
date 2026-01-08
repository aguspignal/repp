import {
	DatabaseRoutine,
	DatabaseRoutineDay,
	RoutineWithDays
} from "../types/routines"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { DatabaseExercise } from "../types/exercises"
import { DatabaseUser } from "../types/user"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface UserState {
	user: DatabaseUser | null
	exercises: DatabaseExercise[]
	routines: RoutineWithDays[]

	loadUser: (u: DatabaseUser | null) => void
	loadExercises: (exs: DatabaseExercise[]) => void
	loadRoutines: (rs: RoutineWithDays[]) => void
	getRoutineByDayId: (dId: number) => DatabaseRoutine

	addExercise: (ex: DatabaseExercise) => void
	addRoutineWithDays: (r: RoutineWithDays) => void
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
			loadExercises: (exs) => set({ exercises: exs }),
			loadRoutines: (rs) => set({ routines: rs }),
			getRoutineByDayId: (dId) => {
				return get().routines.filter((r) =>
					r.days.find((d) => d.id === dId)
				)[0].routine
			},
			addExercise: (exerc) =>
				set({
					exercises: get()
						.exercises.filter((e) => e.id !== exerc.id)
						.concat(exerc)
				}),
			addRoutineWithDays: (routine) =>
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
				set({ exercises: get().exercises.filter((e) => e.id !== eId) }),
			removeRoutine: (rId) =>
				set({
					routines: get().routines.filter((r) => r.routine.id !== rId)
				}),
			removeRoutineDay: (rId, dId) => {
				const routine = get().routines.filter(
					(r) => r.routine.id === rId
				)[0]
				const days = routine.days.filter((d) => d.id === dId)
				const routineAndDay: RoutineWithDays = {
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
