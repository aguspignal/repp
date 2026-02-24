import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import StyledText from "../../components/texts/StyledText"
import ScheduleDay from "../../components/cards/ScheduleDay"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Weekday } from "../../types/routines"
import { useUserStore } from "../../stores/useUserStore"
import { RootStackScreenProps } from "../../navigation/params"
import Button from "../../components/buttons/Button"
import SelectRoutineDayModal from "../../components/modals/SelectRoutineDayModal"

export default function RoutineSchedule({
	navigation,
	route
}: RootStackScreenProps<"RoutineSchedule">) {
	const { t } = useTranslation()
	const { routines } = useUserStore()

	const schedule = routines.find(
		(r) => r.routine.id === route.params.routineId
	)?.schedule

	const [biweekly, setBiweekly] = useState(false)
	const [selectedDay, setSelectedDay] = useState<Weekday | null>(null)
	const [modalVisible, setModalVisible] = useState(false)

	function handleSelectWeekday(weekday: Weekday) {
		setSelectedDay(weekday)
		setModalVisible(true)
	}

	function handleSelectRoutineDay(dayId: number) {}

	function handleSaveChanges() {}

	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<StyledText type="title" align="center">
					{t("titles.weekly-schedule")}
				</StyledText>

				<View style={styles.splitContainer}>
					<StyledText type="boldNote">
						{t("actions.split-in-two-weeks")}
					</StyledText>

					<TouchableOpacity
						onPress={() => setBiweekly((prev) => !prev)}
						style={[
							styles.splitBtn,
							biweekly ? styles.splitSelected : null
						]}
					/>
				</View>

				<View style={styles.schedule}>
					<ScheduleDay
						weekday="Monday"
						routineDay={null}
						onPress={handleSelectWeekday}
					/>
					<ScheduleDay
						weekday="Tuesday"
						routineDay={null}
						onPress={handleSelectWeekday}
					/>
					<ScheduleDay
						weekday="Wednesday"
						routineDay={null}
						onPress={handleSelectWeekday}
					/>
					<ScheduleDay
						weekday="Thursday"
						routineDay={null}
						onPress={handleSelectWeekday}
					/>
					<ScheduleDay
						weekday="Friday"
						routineDay={null}
						onPress={handleSelectWeekday}
					/>
					<ScheduleDay
						weekday="Saturday"
						routineDay={null}
						onPress={handleSelectWeekday}
					/>
					<ScheduleDay
						weekday="Sunday"
						routineDay={null}
						onPress={handleSelectWeekday}
					/>
				</View>

				{biweekly ? (
					<View style={styles.schedule}>
						<ScheduleDay
							weekday="Monday"
							routineDay={null}
							onPress={handleSelectWeekday}
						/>
						<ScheduleDay
							weekday="Tuesday"
							routineDay={null}
							onPress={handleSelectWeekday}
						/>
						<ScheduleDay
							weekday="Wednesday"
							routineDay={null}
							onPress={handleSelectWeekday}
						/>
						<ScheduleDay
							weekday="Thursday"
							routineDay={null}
							onPress={handleSelectWeekday}
						/>
						<ScheduleDay
							weekday="Friday"
							routineDay={null}
							onPress={handleSelectWeekday}
						/>
						<ScheduleDay
							weekday="Saturday"
							routineDay={null}
							onPress={handleSelectWeekday}
						/>
						<ScheduleDay
							weekday="Sunday"
							routineDay={null}
							onPress={handleSelectWeekday}
						/>
					</View>
				) : null}
			</View>

			<Button
				title={t("actions.save-changes")}
				onPress={handleSaveChanges}
			/>

			<SelectRoutineDayModal
				isVisible={modalVisible}
				setIsVisible={setModalVisible}
				title={"a"}
				onSelect={handleSelectRoutineDay}
				routineId={route.params.routineId}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		paddingHorizontal: theme.spacing.s,
		paddingTop: theme.spacing.s,
		paddingBottom: theme.spacing.x4l,
		justifyContent: "space-between"
	},
	contentContainer: {
		gap: theme.spacing.l
	},
	schedule: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	splitContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: theme.spacing.xxs
	},
	splitBtn: {
		borderWidth: 1,
		borderColor: theme.colors.textLight,
		borderRadius: 80,
		width: theme.spacing.m,
		height: theme.spacing.m
	},
	splitSelected: {
		borderWidth: 0,
		backgroundColor: theme.colors.primary
	}
})
