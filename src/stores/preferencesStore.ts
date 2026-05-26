import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { SupportedLocale } from "../i18n"

export type WeightUnit = "kg" | "lb"

type PreferencesState = {
	weightUnit: WeightUnit
	language: SupportedLocale | null
	isHydrated: boolean
	setWeightUnit: (unit: WeightUnit) => void
	setLanguage: (language: SupportedLocale) => void
}

export const usePreferencesStore = create<PreferencesState>()(
	persist(
		set => ({
			weightUnit: "kg",
			language: null,
			isHydrated: false,
			setWeightUnit: weightUnit => set({ weightUnit }),
			setLanguage: language => set({ language }),
		}),
		{
			name: "repp.preferences.v1",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: state => ({
				weightUnit: state.weightUnit,
				language: state.language,
			}),
			onRehydrateStorage: () => state => {
				if (state) state.isHydrated = true
			},
		},
	),
)
