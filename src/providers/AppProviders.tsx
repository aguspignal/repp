import { QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState, type ReactNode } from "react"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { detectDeviceLocale, initI18n } from "../i18n"
import "../i18n/types"
import { getDb } from "../lib/db"
import { queryClient } from "../lib/queryClient"
import { useOnboardingStore } from "../stores/onboardingStore"
import { usePreferencesStore } from "../stores/preferencesStore"

type Props = { children: ReactNode }

export const AppProviders = ({ children }: Props) => {
	const [dbReady, setDbReady] = useState(false)
	const [i18nReady, setI18nReady] = useState(false)
	const hydrateOnboarding = useOnboardingStore(s => s.hydrate)

	useEffect(() => {
		hydrateOnboarding()
		getDb()
			.then(() => setDbReady(true))
			.catch(err => {
				console.error("[AppProviders] Failed to init SQLite", err)
				setDbReady(true)
			})
	}, [hydrateOnboarding])

	useEffect(() => {
		const unsubscribe = usePreferencesStore.persist.onFinishHydration(state => {
			const locale = state.language ?? detectDeviceLocale()
			initI18n(locale)
				.then(() => setI18nReady(true))
				.catch(err => {
					console.error("[AppProviders] Failed to init i18n", err)
					setI18nReady(true)
				})
		})
		if (usePreferencesStore.persist.hasHydrated()) {
			const { language } = usePreferencesStore.getState()
			const locale = language ?? detectDeviceLocale()
			initI18n(locale)
				.then(() => setI18nReady(true))
				.catch(err => {
					console.error("[AppProviders] Failed to init i18n", err)
					setI18nReady(true)
				})
		}
		return unsubscribe
	}, [])

	if (!dbReady || !i18nReady) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator />
			</View>
		)
	}

	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</SafeAreaProvider>
	)
}
