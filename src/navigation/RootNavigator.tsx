import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ActivityIndicator, View } from "react-native"

import { useAuthListener } from "../hooks/useAuth"
import { PlaceholderScreen } from "../screens/PlaceholderScreen"
import { SignInScreen } from "../screens/SignInScreen"
import { useAuthStore } from "../stores/authStore"
import type { AppTabParamList, AuthStackParamList, RootStackParamList } from "./types"

const RootStack = createNativeStackNavigator<RootStackParamList>()
const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const Tabs = createBottomTabNavigator<AppTabParamList>()

const AuthNavigator = () => (
	<AuthStack.Navigator>
		<AuthStack.Screen name="SignIn" component={SignInScreen} options={{ title: "Sign in" }} />
	</AuthStack.Navigator>
)

const HomeScreen = () => <PlaceholderScreen title="Home" />
const WorkoutsScreen = () => <PlaceholderScreen title="Workouts" />
const RoutinesScreen = () => <PlaceholderScreen title="Routines" />
const ExercisesScreen = () => <PlaceholderScreen title="Exercises" />
const ProfileScreen = () => <PlaceholderScreen title="Profile" />

const AppTabsNavigator = () => (
	<Tabs.Navigator>
		<Tabs.Screen name="Home" component={HomeScreen} />
		<Tabs.Screen name="Workouts" component={WorkoutsScreen} />
		<Tabs.Screen name="Routines" component={RoutinesScreen} />
		<Tabs.Screen name="Exercises" component={ExercisesScreen} />
		<Tabs.Screen name="Profile" component={ProfileScreen} />
	</Tabs.Navigator>
)

export const RootNavigator = () => {
	useAuthListener()
	const session = useAuthStore(s => s.session)
	const isReady = useAuthStore(s => s.isReady)

	if (!isReady) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator />
			</View>
		)
	}

	return (
		<NavigationContainer>
			<RootStack.Navigator screenOptions={{ headerShown: false }}>
				{session ? (
					<RootStack.Screen name="App" component={AppTabsNavigator} />
				) : (
					<RootStack.Screen name="Auth" component={AuthNavigator} />
				)}
			</RootStack.Navigator>
		</NavigationContainer>
	)
}
