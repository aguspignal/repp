import { GETROUTINESCHEDULE_KEY } from "../../hooks/useRoutineQuery"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import { Weekday } from "../../types/misc"
import { WEEKDAYS } from "../../resources/constants"
import Button from "../../components/buttons/Button"
import ScheduleDay from "../../components/cards/ScheduleDay"
import SelectRoutineDayModal from "../../components/modals/SelectRoutineDayModal"
import StyledText from "../../components/texts/StyledText"
import ToastNotification from "../../components/notifications/ToastNotification"
import useRoutineMutation from "../../hooks/useRoutineMutation"

export default function RoutineSchedule({
	navigation,
	route: {
		params: { routineId, schedule }
	}
}: RootStackScreenProps<"RoutineSchedule">) {
	const { t } = useTranslation()
	const { routines } = useUserStore()
	const { replaceRoutineScheduleMutation } = useRoutineMutation()

	const { mutate: replaceRoutineSchedule, isPending: isPendingSchedule } =
		replaceRoutineScheduleMutation

	const routine = routines.find((r) => r.routine.id === routineId)

	const [weekOneSchedule, setWeekOneSchedule] = useState<
		Map<Weekday, number>
	>(new Map())

	const [weekTwoSchedule, setWeekTwoSchedule] = useState<
		Map<Weekday, number>
	>(new Map())

	const [biweekly, setBiweekly] = useState(
		schedule?.some((s) => s.is_second_week) ?? false
	)
	const [modalVisible, setModalVisible] = useState(false)
	const [selectedDay, setSelectedDay] = useState<Weekday | null>(null)
	const [selectingSecondWeek, setSelectingSecondWeek] = useState(false)

	function handleSelectWeekday(weekday: Weekday, isSecondWeek = false) {
		setSelectedDay(weekday)
		setSelectingSecondWeek(isSecondWeek)
		setModalVisible(true)
	}

	function handleSelectRoutineDay(dayId: number | undefined) {
		if (!selectedDay) return

		const setter = selectingSecondWeek
			? setWeekTwoSchedule
			: setWeekOneSchedule

		setter((prev) => {
			const copy = new Map(prev)
			if (dayId === undefined) copy.delete(selectedDay)
			else copy.set(selectedDay, dayId)
			return copy
		})

		setSelectedDay(null)
		setSelectingSecondWeek(false)
		setModalVisible(false)
	}

	function handleToggleBiweekly() {
		weekTwoSchedule.clear()
		setBiweekly((prev) => !prev)
	}

	function handleSaveChanges() {
		if (!routine) return

		replaceRoutineSchedule(
			{
				routineDaysIds: routine.days.map((d) => d.id),
				schedule: [
					...[...weekOneSchedule.entries()].map(
						([weekday, routineDayId]) => ({
							weekday,
							routineDayId,
							isSecondWeek: false
						})
					),
					...[...weekTwoSchedule.entries()].map(
						([weekday, routineDayId]) => ({
							weekday,
							routineDayId,
							isSecondWeek: true
						})
					)
				]
			},
			{
				onSuccess: (newSchedule) => {
					if (isPostgrestError(newSchedule)) {
						ToastNotification({
							title: newSchedule.message,
							type: "error"
						})
						return
					}

					invalidateQueries(GETROUTINESCHEDULE_KEY(routineId))
					navigation.goBack()
				}
			}
		)
	}

	function renderWeekSchedule(isSecondWeek = false) {
		const schedule = isSecondWeek ? weekTwoSchedule : weekOneSchedule
		return (
			<View style={styles.schedule}>
				{WEEKDAYS.map((weekday) => (
					<ScheduleDay
						key={weekday}
						weekday={weekday}
						routineDay={
							routine?.days.find(
								(d) => d.id === schedule.get(weekday)
							) ?? null
						}
						onPress={() =>
							handleSelectWeekday(weekday, isSecondWeek)
						}
					/>
				))}
			</View>
		)
	}

	useEffect(() => {
		setWeekOneSchedule(
			new Map(
				schedule
					?.filter((s) => !s.is_second_week)
					.map((s) => [s.weekday, s.routineday_id]) ?? []
			)
		)
		setWeekTwoSchedule(
			new Map(
				schedule
					?.filter((s) => s.is_second_week)
					.map((s) => [s.weekday, s.routineday_id]) ?? []
			)
		)
	}, [schedule])

	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<View style={styles.splitContainer}>
					<StyledText type="boldNote">
						{t("actions.split-in-two-weeks")}
					</StyledText>

					<TouchableOpacity
						onPress={handleToggleBiweekly}
						style={[
							styles.splitBtn,
							biweekly ? styles.splitSelected : null
						]}
					/>
				</View>

				{renderWeekSchedule(false)}
				{biweekly && renderWeekSchedule(true)}
			</View>

			<Button
				title={t("actions.save-changes")}
				onPress={handleSaveChanges}
				isLoading={isPendingSchedule}
			/>

			<SelectRoutineDayModal
				isVisible={modalVisible}
				setIsVisible={setModalVisible}
				title={t("questions.what-will-you-train-on-(weekDay)", {
					weekDay: selectedDay ?? t("attributes.monday")
				})}
				onSelect={handleSelectRoutineDay}
				routineId={routineId}
				showRemoveBtn={
					selectingSecondWeek
						? weekTwoSchedule.has(selectedDay!)
						: weekOneSchedule.has(selectedDay!)
				}
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
