import { Header } from "@react-navigation/elements"
import { navigationStyles } from "../../navigation/styles"
import { RootStackScreenProps } from "../../navigation/params"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"

type Props = {
	route: RootStackScreenProps<"RoutineDayHistory">["route"]
	back?: {
		title: string | undefined
		href: string | undefined
	}
}

export default function RoutineDayHistoryHeader({ route, back }: Props) {
	const { t } = useTranslation()
	const { routines } = useUserStore()

	const thisDay = routines
		.find((r) => r.days.some((d) => d.id === route.params.id))
		?.days.find((d) => d.id === route.params.id)

	return (
		<Header
			title={
				thisDay?.name
					? t("titles.(dayName)-history", { dayName: thisDay.name })
					: t("titles.history")
			}
			headerTintColor={navigationStyles.headerTitle.color}
			headerTitleStyle={navigationStyles.headerTitle}
			headerStyle={navigationStyles.headerBackground}
			headerShadowVisible={false}
			back={back}
		/>
	)
}
