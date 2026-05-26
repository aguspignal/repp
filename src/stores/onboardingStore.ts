import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"

const STORAGE_KEY = "repp.onboarding.completed.v1"

type OnboardingState = {
	hasCompleted: boolean
	isHydrated: boolean
	hydrate: () => Promise<void>
	complete: () => Promise<void>
	reset: () => Promise<void>
}

export const useOnboardingStore = create<OnboardingState>(set => ({
	hasCompleted: false,
	isHydrated: false,
	hydrate: async () => {
		try {
			const raw = await AsyncStorage.getItem(STORAGE_KEY)
			set({ hasCompleted: raw === "true", isHydrated: true })
		} catch (err) {
			console.warn("[onboarding] hydrate failed", err)
			set({ isHydrated: true })
		}
	},
	complete: async () => {
		try {
			await AsyncStorage.setItem(STORAGE_KEY, "true")
		} catch (err) {
			console.warn("[onboarding] persist failed", err)
		}
		set({ hasCompleted: true })
	},
	reset: async () => {
		try {
			await AsyncStorage.removeItem(STORAGE_KEY)
		} catch (err) {
			console.warn("[onboarding] reset failed", err)
		}
		set({ hasCompleted: false })
	},
}))
