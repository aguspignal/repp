import useUserQuery, {
	GETANDUPDATEINITIALDATABYUUID_KEY
} from "../hooks/useUserQuery"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { invalidateQueries } from "../utils/queriesHelpers"
import { navigationStyles } from "./styles"
import { RootStackParams, RootStackScreenProps } from "./params"
import { TabsNavigator } from "./TabsNavigator"
import { theme } from "../resources/theme"
import { useEffect } from "react"
import EditWorkout from "../screens/Workouts/EditWorkout"
import EditWorkoutHeader from "../components/header/EditWorkoutHeader"
import ExerciseHistory from "../screens/Exercises/ExerciseHistory"
import i18next from "i18next"
import Loading from "../screens/Loading"
import RoutineDayHistory from "../screens/Routines/RoutineDayHistory"
import RoutineDayHistoryHeader from "../components/header/RoutineDayHistoryHeader"
import Settings from "../screens/Settings"
import Workout from "../screens/Workouts/Workout"
import WorkoutHeader from "../components/header/WorkoutHeader"
import AddExercisesFromRepo from "../screens/Routines/AddExercisesFromRepo"
import EditRoutineDayHeader from "../components/header/EditRoutineDayHeader"
import EditRoutineDay from "../screens/Routines/EditRoutineDay"

type Props = {
	uuid: string
}
export default function Root({ uuid }: Props) {
	const { getAndUpdateInitialDataByUuid } = useUserQuery()

	const { isPending, isLoading, isFetching } =
		getAndUpdateInitialDataByUuid(uuid)

	useEffect(() => {
		invalidateQueries(GETANDUPDATEINITIALDATABYUUID_KEY(uuid))
	}, [uuid])

	return isPending || isLoading || isFetching ? (
		<Loading />
	) : (
		<RootNavigator />
	)
}

const RootStack = createNativeStackNavigator<RootStackParams>()

function RootNavigator() {
	return (
		<RootStack.Navigator
			initialRouteName="Tabs"
			screenOptions={({ route }) => ({
				headerShown: route.name !== "Tabs",
				headerStyle: navigationStyles.headerBackground,
				headerTitleStyle: navigationStyles.headerTitle,
				headerTintColor: theme.colors.textLight,
				headerShadowVisible: false
			})}
		>
			<RootStack.Screen name="Tabs" component={TabsNavigator} />

			<RootStack.Screen name="Settings" component={Settings} />

			<RootStack.Screen
				name="AddExercisesFromRepo"
				component={AddExercisesFromRepo}
				options={{ headerTitle: i18next.t("actions.add-exercises") }}
			/>

			<RootStack.Screen
				name="EditRoutineDay"
				component={EditRoutineDay}
				options={{
					header: ({ navigation, route, back }) => (
						<EditRoutineDayHeader
							navigation={navigation}
							route={
								route as RootStackScreenProps<"EditRoutineDay">["route"]
							}
							back={back}
						/>
					)
				}}
			/>

			<RootStack.Screen
				name="Workout"
				component={Workout}
				options={{
					header: ({ navigation, route, back }) => (
						<WorkoutHeader
							navigation={navigation}
							route={
								route as RootStackScreenProps<"Workout">["route"]
							}
							back={back}
						/>
					)
				}}
			/>

			<RootStack.Screen
				name="EditWorkout"
				component={EditWorkout}
				options={{
					header: ({ navigation, route, back }) => (
						<EditWorkoutHeader
							navigation={navigation}
							route={
								route as RootStackScreenProps<"EditWorkout">["route"]
							}
							back={back}
						/>
					)
				}}
			/>

			<RootStack.Screen
				name="RoutineDayHistory"
				component={RoutineDayHistory}
				options={{
					header: ({ route, back }) => (
						<RoutineDayHistoryHeader
							route={
								route as RootStackScreenProps<"RoutineDayHistory">["route"]
							}
							back={back}
						/>
					)
				}}
			/>

			<RootStack.Screen
				name="ExerciseHistory"
				component={ExerciseHistory}
				options={{ headerTitle: i18next.t("titles.exercise-history") }}
			/>
		</RootStack.Navigator>
	)
}
