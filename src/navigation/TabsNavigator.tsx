import {
	BottomTabNavigationOptions,
	createBottomTabNavigator
} from "@react-navigation/bottom-tabs"
import {
	ExercisesTabParams,
	ExercisesTabScreenProps,
	RoutinesTabParams,
	RoutinesTabScreenProps,
	TabParams
} from "./params"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { navigationStyles } from "./styles"
import { theme } from "../resources/theme"
import ArchivedRoutines from "../screens/Routines/ArchivedRoutines"
import CreateExercise from "../screens/Exercises/CreateExercise"
import EditExercise from "../screens/Exercises/EditExercise"
import EditExerciseHeader from "../components/header/EditExerciseHeader"
import EditRoutine from "../screens/Routines/EditRoutine"
import ExerciseRepository from "../screens/Exercises/ExerciseRepository"
import i18next from "../lib/i18n"
import Loading from "../screens/Loading"
import MCIcon from "../components/icons/MCIcon"
import MyRoutines from "../screens/Routines/MyRoutines"
import MyRoutinesHeader from "../components/header/MyRoutinesHeader"
import Routine from "../screens/Routines/Routine"
import RoutineHeader from "../components/header/RoutineHeader"
import RoutineSchedule from "../screens/Routines/RoutineSchedule"
import RoutineScheduleHeader from "../components/header/RoutineScheduleHeader"

const Tab = createBottomTabNavigator<TabParams>()
const RoutinesTab = createNativeStackNavigator<RoutinesTabParams>()
const ExercisesTab = createNativeStackNavigator<ExercisesTabParams>()

export function TabsNavigator() {
	return (
		<Tab.Navigator
			initialRouteName="RoutinesTab"
			screenOptions={{
				...getCommonNavigatorOptions(),
				headerShown: false,
				tabBarHideOnKeyboard: true,
				tabBarIconStyle: navigationStyles.tabIconContainer,
				tabBarShowLabel: false,
				tabBarStyle: navigationStyles.tabBar
			}}
		>
			<Tab.Screen
				name="MesocyclesTab"
				component={Loading}
				options={handleTabOptions("layers")}
			/>
			<Tab.Screen
				name="RoutinesTab"
				component={RoutinesTabNavigator}
				options={handleTabOptions("clipboard-text-outline")}
			/>
			<Tab.Screen
				name="ExercisesTab"
				component={ExercisesTabNavigator}
				options={handleTabOptions("dumbbell")}
			/>
			<Tab.Screen
				name="StatsTab"
				component={Loading}
				options={handleTabOptions("chart-line")}
			/>
		</Tab.Navigator>
	)
}

function RoutinesTabNavigator() {
	return (
		<RoutinesTab.Navigator
			initialRouteName="MyRoutines"
			screenOptions={getCommonNavigatorOptions()}
		>
			<RoutinesTab.Screen
				name="MyRoutines"
				component={MyRoutines}
				options={{
					header: ({ navigation, back }) => (
						<MyRoutinesHeader navigation={navigation} back={back} />
					)
				}}
			/>
			<RoutinesTab.Screen
				name="Routine"
				component={Routine}
				options={{
					header: ({ navigation, back, route }) => (
						<RoutineHeader
							navigation={navigation}
							route={
								route as RoutinesTabScreenProps<"Routine">["route"]
							}
							back={back}
						/>
					)
				}}
			/>
			<RoutinesTab.Screen
				name="EditRoutine"
				component={EditRoutine}
				options={{ headerTitle: i18next.t("actions.edit-routine") }}
			/>
			<RoutinesTab.Screen
				name="RoutineSchedule"
				component={RoutineSchedule}
				options={{
					header: ({ back, route }) => (
						<RoutineScheduleHeader
							route={
								route as RoutinesTabScreenProps<"RoutineSchedule">["route"]
							}
							back={back}
						/>
					)
				}}
			/>
			<RoutinesTab.Screen
				name="ArchivedRoutines"
				component={ArchivedRoutines}
				options={{
					headerTitle: i18next.t("titles.archived-routines")
				}}
			/>
		</RoutinesTab.Navigator>
	)
}

function ExercisesTabNavigator() {
	return (
		<ExercisesTab.Navigator screenOptions={getCommonNavigatorOptions()}>
			<ExercisesTab.Screen
				name="ExerciseRepository"
				component={ExerciseRepository}
				options={{
					headerTitle: i18next.t("titles.exercise-repository")
				}}
			/>
			<ExercisesTab.Screen
				name="CreateExercise"
				component={CreateExercise}
				options={{
					headerTitle: i18next.t("actions.create-exercise")
				}}
			/>
			<ExercisesTab.Screen
				name="EditExercise"
				component={EditExercise}
				options={{
					header: ({ navigation, route, back }) => (
						<EditExerciseHeader
							navigation={navigation}
							route={
								route as ExercisesTabScreenProps<"EditExercise">["route"]
							}
							back={back}
						/>
					)
				}}
			/>
		</ExercisesTab.Navigator>
	)
}

function handleTabOptions(
	tabIcon: React.ComponentProps<typeof MCIcon>["name"]
): BottomTabNavigationOptions {
	return {
		tabBarIcon: ({ focused }) => (
			<MCIcon
				name={tabIcon}
				style={[
					navigationStyles.tabIcon,
					focused ? navigationStyles.tabIconFocused : {}
				]}
			/>
		)
	}
}

function getCommonNavigatorOptions() {
	return {
		headerShadowVisible: false,
		headerStyle: navigationStyles.headerBackground,
		headerTintColor: theme.colors.textLight
	}
}
