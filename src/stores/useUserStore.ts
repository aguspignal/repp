import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { DatabaseUser } from "../types/user"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface UserState {
	user: DatabaseUser | null
	loadUser: (u: DatabaseUser | null) => void
}

export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({
			user: null,
			loadUser: (u) => set({user: u})
		}),
		{
			name: "user-store",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
)
