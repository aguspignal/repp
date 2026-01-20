import { Header } from "@react-navigation/elements"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { navigationStyles } from "../../navigation/styles"
import { ParamListBase } from "@react-navigation/native"
import { TouchableOpacity } from "react-native"
import MCIcon from "../icons/MCIcon"
import { useUserStore } from "../../stores/useUserStore"
import { RootStackScreenProps } from "../../navigation/params"
import { useTranslation } from "react-i18next"

type Props = {
	navigation: NativeStackNavigationProp<ParamListBase, string, undefined>
	route: RootStackScreenProps<"RoutineSchedule">["route"]
	back?: {
		title: string | undefined
		href: string | undefined
	}
}

export default function RoutineScheduleHeader({
	navigation,
	route,
	back
}: Props) {
	const { t } = useTranslation()
	const { routines } = useUserStore()

	const routine = routines.find(
		(r) => r.routine.id === route.params.routineId
	)

	return (
		<Header
			title={
				routine
					? t("titles.(routineName)", {
							routineName: routine.routine.id
						})
					: t("titles.schedule")
			}
			headerTintColor={navigationStyles.headerTitle.color}
			headerTitleStyle={navigationStyles.headerTitle}
			headerStyle={navigationStyles.headerBackground}
			headerShadowVisible={false}
			back={back}
		/>
	)
}
