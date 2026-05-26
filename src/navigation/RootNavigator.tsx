import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ActivityIndicator, View } from "react-native"

import { useAuthListener } from "../hooks/useAuth"
import { OnboardingScreen } from "../screens/auth/OnboardingScreen"
import { SignInScreen } from "../screens/auth/SignInScreen"
import { SignUpScreen } from "../screens/auth/SignUpScreen"
import { WelcomeScreen } from "../screens/auth/WelcomeScreen"
import { PlaceholderScreen } from "../screens/PlaceholderScreen"
import { useAuthStore } from "../stores/authStore"
import { useOnboardingStore } from "../stores/onboardingStore"
import type { AppTabParamList, AuthStackParamList, RootStackParamList } from "./types"

const RootStack = createNativeStackNavigator<RootStackParamList>()
const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const Tabs = createBottomTabNavigator<AppTabParamList>()

const AuthNavigator = () => {
	const hasCompleted = useOnboardingStore(s => s.hasCompleted)
	const initialRoute: keyof AuthStackParamList = hasCompleted ? "SignIn" : "Welcome"

	return (
		<AuthStack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name="Welcome" component={WelcomeScreen} />
			<AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
			<AuthStack.Screen name="SignIn" component={SignInScreen} />
			<AuthStack.Screen name="SignUp" component={SignUpScreen} />
		</AuthStack.Navigator>
	)
}

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
	const authReady = useAuthStore(s => s.isReady)
	const onboardingReady = useOnboardingStore(s => s.isHydrated)

	if (!authReady || !onboardingReady) {
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
