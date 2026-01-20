import {
	invalidateQueries,
	isPostgrestError
} from "../../../utils/queriesHelpers"
import {
	DatabaseRoutineDay,
	RoutineWithDaysAndExercises
} from "../../../types/routines"
import {
	GETROUTINEWITHDAYSANDEXERCISESBYID_KEY,
	GETUSERROUTINESWITHDAYSLAZY_KEY
} from "../../../hooks/useRoutineQuery"
import { RefreshControl, StyleSheet, View } from "react-native"
import { RootStackNavigationProp } from "../../../navigation/params"
import { ScrollView } from "react-native-gesture-handler"
import { sortRoutineDaysAndExercisesByName } from "../../../utils/sorting"
import { theme } from "../../../resources/theme"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../../stores/useUserStore"
import Button from "../../../components/buttons/Button"
import CreateRoutineDayModal from "../../../components/modals/CreateRoutineDayModal"
import RoutineDayCard from "../../../components/cards/RoutineDayCard"
import StartWorkoutModal from "../../../components/modals/StartWorkoutModal"
import StyledText from "../../../components/texts/StyledText"
import ToastNotification from "../../../components/notifications/ToastNotification"
import useRoutineMutation from "../../../hooks/useRoutineMutation"
import ScheduleDay from "../../../components/cards/ScheduleDay"

type Props = {
	routine: RoutineWithDaysAndExercises
	isPendingData: boolean
}
export default function RoutineInner({
	routine: { routine, daysAndExercises },
	isPendingData
}: Props) {
	const { t } = useTranslation()
	const { user, addRoutineDay } = useUserStore()
	const { createRoutineDayMutation } = useRoutineMutation()
	const nav = useNavigation<RootStackNavigationProp>()

	const { mutate: createRoutineDay, isPending } = createRoutineDayMutation

	const [refreshing, setRefreshing] = useState(false)
	const [routineDayModalVisible, setRoutineDayModalVisible] = useState(false)
	const [startWorkoutModalVisible, setStartWorkoutModalVisible] =
		useState(false)

	function handleStartWorkout(dayId: number) {
		nav.navigate("Workout", { dayId })
	}

	function handleAddRoutineDay({
		code,
		name
	}: {
		code: string
		name: string
	}) {
		createRoutineDay(
			{
				routineId: routine.id,
				code,
				name
			},
			{
				onSuccess: (newDay) => {
					if (!newDay || isPostgrestError(newDay)) {
						ToastNotification({
							title: t(
								"error-messages.trouble-getting-routine-day"
							)
						})
						return
					}

					addRoutineDay(newDay)
					invalidateQueries(
						GETROUTINEWITHDAYSANDEXERCISESBYID_KEY(
							newDay.routine_id
						)
					)
					setRoutineDayModalVisible(false)
					nav.navigate("EditRoutineDay", { id: newDay.id })
				}
			}
		)
	}

	function handleEditDay(day: DatabaseRoutineDay | null) {
		if (!day) return
		nav.navigate("EditRoutineDay", { id: day.id })
	}

	function handleSeeDayHistory(id: number) {
		nav.navigate("RoutineDayHistory", { id, canEdit: true })
	}

	function handleRefresh() {
		if (!user) return
		try {
			setRefreshing(true)
			invalidateQueries(GETUSERROUTINESWITHDAYSLAZY_KEY(user.id))
			invalidateQueries(
				GETROUTINEWITHDAYSANDEXERCISESBYID_KEY(routine.id)
			)
		} catch (error) {
			console.log(error)
		} finally {
			setRefreshing(false)
		}
	}

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl
					onRefresh={handleRefresh}
					refreshing={refreshing || isPendingData}
				/>
			}
		>
			<StyledText type="title" align="center">
				{routine.name}
			</StyledText>

			{routine.description ? (
				<View style={styles.description}>
					<StyledText type="text">{routine.description}</StyledText>
				</View>
			) : null}

			<Button
				title={t("actions.start-workout")}
				onPress={() => setStartWorkoutModalVisible(true)}
				size="l"
				alignSelf
			/>

			<View style={styles.scheduleContainer}>
				<StyledText type="subtitle">{t("titles.schedule")}</StyledText>

				<View style={styles.schedule}>
					<ScheduleDay weekday="Monday" routineDay={null} />
					<ScheduleDay weekday="Tuesday" routineDay={null} />
					<ScheduleDay weekday="Wednesday" routineDay={null} />
					<ScheduleDay weekday="Thursday" routineDay={null} />
					<ScheduleDay weekday="Friday" routineDay={null} />
					<ScheduleDay weekday="Saturday" routineDay={null} />
					<ScheduleDay weekday="Sunday" routineDay={null} />
				</View>
			</View>

			{sortRoutineDaysAndExercisesByName(daysAndExercises)
				.filter((de) => !de.day.deleted)
				.map((de) => (
					<RoutineDayCard
						routineDay={de.day}
						rdExercises={de.exercises}
						onPressCard={handleEditDay}
						onPressHistory={handleSeeDayHistory}
						key={de.day.id}
					/>
				))}
			<RoutineDayCard
				routineDay={null}
				title={t("actions.add-day")}
				color="primary"
				onPressCard={() => setRoutineDayModalVisible(true)}
			/>

			<CreateRoutineDayModal
				isVisible={routineDayModalVisible}
				setIsVisible={setRoutineDayModalVisible}
				onCreate={handleAddRoutineDay}
				onCancel={() => setRoutineDayModalVisible(false)}
				isLoadingCreate={isPending}
			/>

			<StartWorkoutModal
				isVisible={startWorkoutModalVisible}
				setIsVisible={setStartWorkoutModalVisible}
				onStart={handleStartWorkout}
				routineId={routine.id}
			/>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		paddingHorizontal: theme.spacing.s
	},
	contentContainer: {
		gap: theme.spacing.l,
		paddingBottom: theme.spacing.x3l
	},
	description: {
		padding: theme.spacing.xs,
		backgroundColor: theme.colors.backgroundDark,
		borderRadius: theme.spacing.xxs
	},
	scheduleContainer: {
		gap: theme.spacing.xxs
	},
	schedule: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: theme.spacing.s
	}
})
