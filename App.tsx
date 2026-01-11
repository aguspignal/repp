import {
	initialWindowMetrics,
	SafeAreaProvider
} from "react-native-safe-area-context"
import "./src/lib/i18n"
import "./src/lib/sheets"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { MenuProvider } from "react-native-popup-menu"
import { NavigationContainer } from "@react-navigation/native"
import { NotifierWrapper } from "react-native-notifier"
import { queryClient } from "./src/lib/reactquery"
import { QueryClientProvider } from "@tanstack/react-query"
import Main from "./Main"
import { SheetProvider } from "react-native-actions-sheet"
import { Sheets } from "./src/lib/sheets"

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider
				style={{ marginBottom: initialWindowMetrics?.insets.bottom }}
			>
				<QueryClientProvider client={queryClient}>
					<MenuProvider>
						<NotifierWrapper>
							<SheetProvider>
								<Sheets />
								<NavigationContainer>
									<Main />
								</NavigationContainer>
							</SheetProvider>
						</NotifierWrapper>
					</MenuProvider>
				</QueryClientProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
