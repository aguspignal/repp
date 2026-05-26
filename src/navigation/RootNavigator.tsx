import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, View } from "react-native"

import { Icon, type IconName } from "../components/ui"
import { useAuthListener } from "../hooks/useAuth"
import { OnboardingScreen } from "../screens/auth/OnboardingScreen"
import { SignInScreen } from "../screens/auth/SignInScreen"
import { SignUpScreen } from "../screens/auth/SignUpScreen"
import { WelcomeScreen } from "../screens/auth/WelcomeScreen"
import { PlaceholderScreen } from "../screens/PlaceholderScreen"
import { useAuthStore } from "../stores/authStore"
import { useOnboardingStore } from "../stores/onboardingStore"
import { theme } from "../theme"
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

const HomeScreen = () => {
	const { t } = useTranslation()
	return <PlaceholderScreen title={t("tabs.home")} />
}
const WorkoutsScreen = () => {
	const { t } = useTranslation()
	return <PlaceholderScreen title={t("tabs.workouts")} />
}
const RoutinesScreen = () => {
	const { t } = useTranslation()
	return <PlaceholderScreen title={t("tabs.routines")} />
}
const ExercisesScreen = () => {
	const { t } = useTranslation()
	return <PlaceholderScreen title={t("tabs.exercises")} />
}
const ProfileScreen = () => {
	const { t } = useTranslation()
	return <PlaceholderScreen title={t("tabs.profile")} />
}

type TabKey = keyof AppTabParamList

const tabIcons: Record<TabKey, { active: IconName; inactive: IconName }> = {
	Home: { active: "home", inactive: "home-outline" },
	Workouts: { active: "flame", inactive: "flame-outline" },
	Routines: { active: "calendar", inactive: "calendar-outline" },
	Exercises: { active: "barbell", inactive: "barbell-outline" },
	Profile: { active: "person", inactive: "person-outline" },
}

const AppTabsNavigator = () => {
	const { t } = useTranslation()
	return (
		<Tabs.Navigator
			screenOptions={({ route }) => ({
				tabBarActiveTintColor: theme.colors.primary,
				tabBarInactiveTintColor: theme.colors.grayDark,
				tabBarStyle: {
					backgroundColor: theme.colors.backgroundBlack,
					borderTopColor: theme.colors.backgroundGray,
				},
				headerStyle: { backgroundColor: theme.colors.backgroundBlack },
				headerTintColor: theme.colors.textLight,
				tabBarIcon: ({ focused, color, size }) => {
					const key = route.name as TabKey
					const name = focused ? tabIcons[key].active : tabIcons[key].inactive
					return <Icon name={name} size={size} color={color} />
				},
			})}
		>
			<Tabs.Screen name="Home" component={HomeScreen} options={{ title: t("tabs.home") }} />
			<Tabs.Screen
				name="Workouts"
				component={WorkoutsScreen}
				options={{ title: t("tabs.workouts") }}
			/>
			<Tabs.Screen
				name="Routines"
				component={RoutinesScreen}
				options={{ title: t("tabs.routines") }}
			/>
			<Tabs.Screen
				name="Exercises"
				component={ExercisesScreen}
				options={{ title: t("tabs.exercises") }}
			/>
			<Tabs.Screen
				name="Profile"
				component={ProfileScreen}
				options={{ title: t("tabs.profile") }}
			/>
		</Tabs.Navigator>
	)
}

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
