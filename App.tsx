import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from '@react-navigation/native'
import { queryClient } from "./src/lib/reactquery"
import { QueryClientProvider } from "@tanstack/react-query"
import Main from './Main';

export default function App() {
	return (
		<GestureHandlerRootView style={{flex: 1}}>
			<SafeAreaProvider style={{ marginBottom: initialWindowMetrics?.insets.bottom }}>
				<QueryClientProvider client={queryClient}>
					<NavigationContainer>
						<Main />
					</NavigationContainer>
				</QueryClientProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
  	);
}