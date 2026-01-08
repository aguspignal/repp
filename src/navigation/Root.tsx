import useUserQuery, {
	GETANDUPDATEINITIALDATABYUUID_KEY
} from "../hooks/useUserQuery"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { invalidateQueries } from "../utils/queriesHelpers"
import { navigationStyles } from "./styles"
import { RootStackParams, RootStackScreenProps } from "./params"
import { theme } from "../resources/theme"
import { useEffect } from "react"
import CreateExercise from "../screens/Exercises/CreateExercise"
import EditExercise from "../screens/Exercises/EditExercise"
import EditExerciseHeader from "../components/header/EditExerciseHeader"
import EditRoutineDay from "../screens/Routines/EditRoutineDay"
import EditRoutineDayHeader from "../components/header/EditRoutineDayHeader"
import ExerciseRepository from "../screens/Exercises/ExerciseRepository"
import Home from "../screens/Home"
import HomeHeader from "../components/header/HomeHeader"
import i18next from "i18next"
import Loading from "../screens/Loading"
import Routine from "../screens/Routines/Routine"
import Settings from "../screens/Settings"
import EditRoutine from "../screens/Routines/EditRoutine"
import RoutineHeader from "../components/header/RoutineHeader"

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
			screenOptions={{
				headerStyle: navigationStyles.headerBackground,
				headerTitleStyle: navigationStyles.headerTitle,
				headerTintColor: theme.colors.textLight,
				headerShadowVisible: false
			}}
		>
			<RootStack.Screen
				name="Home"
				component={Home}
				options={{
					header: ({ navigation, back }) => (
						<HomeHeader navigation={navigation} back={back} />
					)
				}}
			/>
			<RootStack.Screen name="Settings" component={Settings} />
			<RootStack.Screen
				name="ExerciseRepository"
				component={ExerciseRepository}
				options={{
					headerTitle: i18next.t("titles.exercise-repository")
				}}
			/>
			<RootStack.Screen
				name="CreateExercise"
				component={CreateExercise}
				options={{
					headerTitle: i18next.t("actions.create-exercise")
				}}
			/>
			<RootStack.Screen
				name="EditExercise"
				component={EditExercise}
				options={{
					header: ({ navigation, route, back }) => (
						<EditExerciseHeader
							navigation={navigation}
							route={
								route as RootStackScreenProps<"EditExercise">["route"]
							}
							back={back}
						/>
					)
				}}
			/>
			<RootStack.Screen
				name="Routine"
				component={Routine}
				options={{
					header: ({ navigation, back, route }) => (
						<RoutineHeader
							navigation={navigation}
							route={
								route as RootStackScreenProps<"Routine">["route"]
							}
							back={back}
						/>
					)
				}}
			/>
			<RootStack.Screen
				name="EditRoutine"
				component={EditRoutine}
				options={{ headerTitle: i18next.t("actions.edit-routine") }}
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
		</RootStack.Navigator>
	)
}
