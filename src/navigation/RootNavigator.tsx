import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Pressable, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Icon, type IconName } from "../components/ui"
import { useAuthListener } from "../hooks/useAuth"
import { OnboardingScreen } from "../screens/auth/OnboardingScreen"
import { SignInScreen } from "../screens/auth/SignInScreen"
import { SignUpScreen } from "../screens/auth/SignUpScreen"
import { WelcomeScreen } from "../screens/auth/WelcomeScreen"
import { HomeScreen } from "../screens/home/HomeScreen"
import { ExerciseCreateScreen } from "../screens/library/ExerciseCreateScreen"
import { ExerciseDetailScreen } from "../screens/library/ExerciseDetailScreen"
import { HistoryScreen } from "../screens/history/HistoryScreen"
import { ExercisesScreen } from "../screens/library/ExercisesScreen"
import { RoutinesScreen } from "../screens/library/RoutinesScreen"
import { DeletedExercisesScreen } from "../screens/profile/DeletedExercisesScreen"
import { ProfileScreen } from "../screens/profile/ProfileScreen"
import { SettingsScreen } from "../screens/profile/SettingsScreen"
import { useAuthStore } from "../stores/authStore"
import { useOnboardingStore } from "../stores/onboardingStore"
import { theme } from "../theme"
import type {
	AppTabParamList,
	AuthStackParamList,
	HistoryStackParamList,
	HomeStackParamList,
	LibraryTopTabParamList,
	ProfileStackParamList,
	RootStackParamList,
} from "./types"

const RootStack = createNativeStackNavigator<RootStackParamList>()
const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const Tabs = createBottomTabNavigator<AppTabParamList>()
const HomeStack = createNativeStackNavigator<HomeStackParamList>()
const LibraryTabs = createMaterialTopTabNavigator<LibraryTopTabParamList>()
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>()
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>()

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

const stackScreenOptions = {
	headerStyle: { backgroundColor: theme.colors.backgroundBlack },
	headerTitleStyle: { color: theme.colors.textLight },
	headerTintColor: theme.colors.textLight,
	headerShadowVisible: false,
	contentStyle: { backgroundColor: theme.colors.backgroundBlack },
} as const

const HomeNavigator = () => {
	const { t } = useTranslation()
	return (
		<HomeStack.Navigator screenOptions={stackScreenOptions}>
			<HomeStack.Screen
				name="HomeMain"
				component={HomeScreen}
				options={{ title: t("home.title") }}
			/>
		</HomeStack.Navigator>
	)
}

const LibraryNavigator = () => {
	const { t } = useTranslation()
	return (
		<SafeAreaView
			edges={["top"]}
			style={{ flex: 1, backgroundColor: theme.colors.backgroundBlack }}
		>
			<LibraryTabs.Navigator
				screenOptions={{
					tabBarActiveTintColor: theme.colors.primary,
					tabBarInactiveTintColor: theme.colors.grayDark,
					tabBarStyle: {
						backgroundColor: theme.colors.backgroundBlack,
						elevation: 0,
						shadowOpacity: 0,
						borderBottomColor: theme.colors.backgroundGray,
						borderBottomWidth: 1,
					},
					tabBarIndicatorStyle: { backgroundColor: theme.colors.primary, height: 2 },
					tabBarLabelStyle: {
						fontWeight: theme.fontWeight.semibold,
						fontSize: theme.fontSize.s,
						textTransform: "none",
					},
				}}
			>
				<LibraryTabs.Screen
					name="Routines"
					component={RoutinesScreen}
					options={{ title: t("library.routines") }}
				/>
				<LibraryTabs.Screen
					name="Exercises"
					component={ExercisesScreen}
					options={{ title: t("library.exercises") }}
				/>
			</LibraryTabs.Navigator>
		</SafeAreaView>
	)
}

const HistoryNavigator = () => {
	const { t } = useTranslation()
	return (
		<HistoryStack.Navigator screenOptions={stackScreenOptions}>
			<HistoryStack.Screen
				name="HistoryMain"
				component={HistoryScreen}
				options={{ title: t("history.title") }}
			/>
		</HistoryStack.Navigator>
	)
}

const ProfileNavigator = () => {
	const { t } = useTranslation()
	return (
		<ProfileStack.Navigator screenOptions={stackScreenOptions}>
			<ProfileStack.Screen
				name="ProfileMain"
				component={ProfileScreen}
				options={({ navigation }) => ({
					title: t("profile.title"),
					headerRight: () => (
						<Pressable
							onPress={() => navigation.navigate("Settings")}
							hitSlop={10}
							accessibilityRole="button"
							accessibilityLabel={t("profile.settings")}
						>
							<Icon name="settings-outline" color="textLight" size={22} />
						</Pressable>
					),
				})}
			/>
			<ProfileStack.Screen
				name="Settings"
				component={SettingsScreen}
				options={{ title: t("settings.title") }}
			/>
			<ProfileStack.Screen
				name="DeletedExercises"
				component={DeletedExercisesScreen}
				options={{ title: t("deletedExercises.title") }}
			/>
		</ProfileStack.Navigator>
	)
}

type TabKey = keyof AppTabParamList

const tabIcons: Record<TabKey, { active: IconName; inactive: IconName }> = {
	Home: { active: "home", inactive: "home-outline" },
	Library: { active: "library", inactive: "library-outline" },
	History: { active: "time", inactive: "time-outline" },
	Profile: { active: "person", inactive: "person-outline" },
}

const AppTabsNavigator = () => {
	const { t } = useTranslation()
	return (
		<Tabs.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarActiveTintColor: theme.colors.primary,
				tabBarInactiveTintColor: theme.colors.grayDark,
				tabBarStyle: {
					backgroundColor: theme.colors.backgroundBlack,
					borderTopColor: theme.colors.backgroundGray,
				},
				tabBarIcon: ({ focused, color, size }) => {
					const key = route.name as TabKey
					const name = focused ? tabIcons[key].active : tabIcons[key].inactive
					return <Icon name={name} size={size} color={color} />
				},
			})}
		>
			<Tabs.Screen
				name="Home"
				component={HomeNavigator}
				options={{ title: t("tabs.home") }}
			/>
			<Tabs.Screen
				name="Library"
				component={LibraryNavigator}
				options={{ title: t("tabs.library") }}
			/>
			<Tabs.Screen
				name="History"
				component={HistoryNavigator}
				options={{ title: t("tabs.history") }}
			/>
			<Tabs.Screen
				name="Profile"
				component={ProfileNavigator}
				options={{ title: t("tabs.profile") }}
			/>
		</Tabs.Navigator>
	)
}

export const RootNavigator = () => {
	useAuthListener()
	const { t } = useTranslation()
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
					<RootStack.Group>
						<RootStack.Screen name="App" component={AppTabsNavigator} />
						<RootStack.Screen
							name="ExerciseCreate"
							component={ExerciseCreateScreen}
							options={{
								...stackScreenOptions,
								headerShown: true,
								presentation: "modal",
								title: t("exerciseForm.title"),
							}}
						/>
						<RootStack.Screen
							name="ExerciseDetail"
							component={ExerciseDetailScreen}
							options={{
								...stackScreenOptions,
								headerShown: true,
								title: t("exerciseForm.editTitle"),
							}}
						/>
					</RootStack.Group>
				) : (
					<RootStack.Screen name="Auth" component={AuthNavigator} />
				)}
			</RootStack.Navigator>
		</NavigationContainer>
	)
}
