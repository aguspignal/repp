import { DatabaseSchedule } from "../../types/routines"
import { RootStackNavigationProp } from "../../navigation/params"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useUserStore } from "../../stores/useUserStore"
import { Weekday } from "../../types/misc"
import { WEEKDAYS } from "../../resources/constants"
import ScheduleDay from "./ScheduleDay"
import { theme } from "../../resources/theme"

type Props = {
	schedule: DatabaseSchedule[] | undefined
	routineId: number
	navOnPress?: boolean
}
export default function RoutineScheduleCard({
	schedule,
	routineId,
	navOnPress = false
}: Props) {
	const { routines } = useUserStore()
	const nav = useNavigation<RootStackNavigationProp>()
	const hasSecondWeek = schedule?.some((s) => s.is_second_week)

	function getRoutineDayForWeekday(weekday: Weekday, isSecondWeek: boolean) {
		const match = schedule?.find(
			(s) => s.weekday === weekday && s.is_second_week === isSecondWeek
		)
		const routineDays = routines.find(
			(r) => r.routine.id === routineId
		)?.days
		return routineDays?.find((d) => d.id === match?.routineday_id) ?? null
	}

	function renderWeek(isSecondWeek = false) {
		return (
			<View style={styles.week}>
				{WEEKDAYS.map((weekday) => (
					<ScheduleDay
						key={weekday}
						weekday={weekday}
						routineDay={getRoutineDayForWeekday(
							weekday,
							isSecondWeek
						)}
					/>
				))}
			</View>
		)
	}

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() =>
				navOnPress &&
				nav.navigate("Tabs", {
					screen: "RoutinesTab",
					params: {
						screen: "RoutineSchedule",
						params: { routineId, schedule }
					}
				})
			}
			activeOpacity={navOnPress ? 0.6 : 1}
		>
			{renderWeek(false)}
			{hasSecondWeek && renderWeek(true)}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: theme.spacing.s
	},
	week: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
		// gap: theme.spacing.m
	}
})
