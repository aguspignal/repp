import { create } from "zustand"

export type WeightUnit = "kg" | "lb"
export type ThemeMode = "light" | "dark" | "system"

type PreferencesState = {
	weightUnit: WeightUnit
	theme: ThemeMode
	setWeightUnit: (unit: WeightUnit) => void
	setTheme: (theme: ThemeMode) => void
}

export const usePreferencesStore = create<PreferencesState>(set => ({
	weightUnit: "kg",
	theme: "system",
	setWeightUnit: weightUnit => set({ weightUnit }),
	setTheme: theme => set({ theme }),
}))
