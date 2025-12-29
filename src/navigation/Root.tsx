import { createNativeStackNavigator } from "@react-navigation/native-stack"
import useUserQuery, {
	GETANDUPDATEINITIALDATABYUUID_KEY
} from "../hooks/useUserQuery"
import { invalidateQueries } from "../utils/queriesHelpers"
import { navigationStyles } from "./styles"
import { RootStackParams } from "./params"
import { theme } from "../resources/theme"
import { useEffect } from "react"
import ExerciseRepository from "../screens/Exercises/ExerciseRepository"
import Home from "../screens/Home"
import HomeHeader from "../components/header/HomeHeader"
import i18next from "i18next"
import Settings from "../screens/Settings"
import Loading from "../screens/Loading"
import { CreateExercise, EditExercise } from "../screens/Exercises/Exercise"

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
					headerTitle: i18next.t("actions.edit-exercise")
				}}
			/>
		</RootStack.Navigator>
	)
}
