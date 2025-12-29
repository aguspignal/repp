import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { DatabaseUser } from "../types/user"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DatabaseExercise } from "../types/exercises"

interface UserState {
	user: DatabaseUser | null
	exercises: DatabaseExercise[]

	loadUser: (u: DatabaseUser | null) => void
	loadExercises: (exs: DatabaseExercise[]) => void

	addExercise: (ex: DatabaseExercise) => void

	removeExercise: (eId: number) => void
	clearUserStore: () => void
}

export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({
			user: null,
			exercises: [],

			loadUser: (u) => set({ user: u }),
			loadExercises: (exs) => set({ exercises: exs }),

			addExercise: (ex) =>
				set({
					exercises: get()
						.exercises.filter((e) => e.id !== ex.id)
						.concat(ex)
				}),

			removeExercise: (eId) =>
				set({ exercises: get().exercises.filter((e) => e.id !== eId) }),
			clearUserStore: () => set({ user: null, exercises: [] })
		}),
		{
			name: "user-store",
			storage: createJSONStorage(() => AsyncStorage)
		}
	)
)
