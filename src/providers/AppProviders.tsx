import { QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState, type ReactNode } from "react"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { getDb } from "../lib/db"
import { queryClient } from "../lib/queryClient"

type Props = { children: ReactNode }

export const AppProviders = ({ children }: Props) => {
	const [dbReady, setDbReady] = useState(false)

	useEffect(() => {
		getDb()
			.then(() => setDbReady(true))
			.catch(err => {
				console.error("[AppProviders] Failed to init SQLite", err)
				setDbReady(true)
			})
	}, [])

	if (!dbReady) {
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
