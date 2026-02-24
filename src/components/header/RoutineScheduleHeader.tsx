import { Header } from "@react-navigation/elements"
import { navigationStyles } from "../../navigation/styles"
import { RootStackScreenProps } from "../../navigation/params"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"

type Props = {
	route: RootStackScreenProps<"RoutineSchedule">["route"]
	back?: {
		title: string | undefined
		href: string | undefined
	}
}

export default function RoutineScheduleHeader({ route, back }: Props) {
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
							routineName: routine.routine.name
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
