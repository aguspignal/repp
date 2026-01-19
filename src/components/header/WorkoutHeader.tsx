import { Header } from "@react-navigation/elements"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { navigationStyles } from "../../navigation/styles"
import { ParamListBase } from "@react-navigation/native"
import { RootStackScreenProps } from "../../navigation/params"
import { TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import MCIcon from "../icons/MCIcon"

type Props = {
	navigation: NativeStackNavigationProp<ParamListBase, string, undefined>
	route: RootStackScreenProps<"Workout">["route"]
	back?: {
		title: string | undefined
		href: string | undefined
	}
}

export default function WorkoutHeader({ navigation, route, back }: Props) {
	const { t } = useTranslation()
	const { routines } = useUserStore()

	const thisDay = routines
		.find((r) => r.days.some((d) => d.id === route.params.dayId))
		?.days.find((d) => d.id === route.params.dayId)

	return (
		<Header
			title={t("titles.(dayName)-workout", {
				dayName: thisDay?.name || t("attributes.new")
			})}
			headerTitleStyle={navigationStyles.headerTitle}
			headerRight={() => (
				<HeaderRight
					navigation={navigation}
					dayId={route.params.dayId}
				/>
			)}
			headerStyle={navigationStyles.headerBackground}
			headerShadowVisible={false}
			headerTintColor={navigationStyles.headerTextColor.color}
			back={back}
		/>
	)
}

type HeaderRightProps = {
	navigation: NativeStackNavigationProp<ParamListBase, string, undefined>
	dayId: number
}
function HeaderRight({ navigation, dayId }: HeaderRightProps) {
	return (
		<TouchableOpacity
			onPress={() =>
				navigation.navigate("RoutineDayHistory", {
					id: dayId,
					canEdit: false
				})
			}
			style={navigationStyles.headerRightContainer}
		>
			<MCIcon name="history" style={navigationStyles.headerIcon} />
		</TouchableOpacity>
	)
}
