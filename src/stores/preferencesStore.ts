import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { SupportedLocale } from "../i18n"

export type WeightUnit = "kg" | "lb"
export type ThemeMode = "light" | "dark" | "system"

type PreferencesState = {
	weightUnit: WeightUnit
	theme: ThemeMode
	language: SupportedLocale | null
	isHydrated: boolean
	setWeightUnit: (unit: WeightUnit) => void
	setTheme: (theme: ThemeMode) => void
	setLanguage: (language: SupportedLocale) => void
}

export const usePreferencesStore = create<PreferencesState>()(
	persist(
		set => ({
			weightUnit: "kg",
			theme: "system",
			language: null,
			isHydrated: false,
			setWeightUnit: weightUnit => set({ weightUnit }),
			setTheme: theme => set({ theme }),
			setLanguage: language => set({ language }),
		}),
		{
			name: "repp.preferences.v1",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: state => ({
				weightUnit: state.weightUnit,
				theme: state.theme,
				language: state.language,
			}),
			onRehydrateStorage: () => state => {
				if (state) state.isHydrated = true
			},
		},
	),
)
