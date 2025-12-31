import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { DatabaseUser } from "../types/user"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DatabaseExercise } from "../types/exercises"
import {
	DatabaseRoutine,
	DatabaseRoutineDay,
	RoutineAndDays
} from "../types/routines"

interface UserState {
	user: DatabaseUser | null
	exercises: DatabaseExercise[]
	routines: RoutineAndDays[]

	loadUser: (u: DatabaseUser | null) => void
	loadExercises: (exs: DatabaseExercise[]) => void
	loadRoutines: (rs: RoutineAndDays[]) => void

	addExercise: (ex: DatabaseExercise) => void
	addRoutine: (r: RoutineAndDays) => void
	addRoutineDay: (rd: DatabaseRoutineDay) => void

	removeExercise: (eId: number) => void
	removeRoutine: (rId: number) => void
	clearUserStore: () => void
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

			addExercise: (exerc) =>
				set({
					exercises: get()
						.exercises.filter((e) => e.id !== exerc.id)
						.concat(exerc)
				}),
			addRoutine: (routine) =>
				set({
					routines: get()
						.routines.filter(
							(r) => r.routine.id !== routine.routine.id
						)
						.concat(routine)
				}),
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
			clearUserStore: () => set({ user: null, exercises: [] })
		}),
		{
			name: "user-store",
			storage: createJSONStorage(() => AsyncStorage)
		}
	)
)
