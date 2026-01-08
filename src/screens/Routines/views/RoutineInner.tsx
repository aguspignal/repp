import {
	invalidateQueries,
	isPostgrestError
} from "../../../utils/queriesHelpers"
import {
	DatabaseRoutineDay,
	RoutineWithDaysAndExercises
} from "../../../types/routines"
import { GETROUTINEWITHDAYSANDEXERCISESBYID_KEY } from "../../../hooks/useRoutineQuery"
import { RootStackNavigationProp } from "../../../navigation/params"
import { ScrollView } from "react-native-gesture-handler"
import { StyleSheet } from "react-native"
import { theme } from "../../../resources/theme"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../../stores/useUserStore"
import Button from "../../../components/buttons/Button"
import CreateRoutineDayModal from "../../../components/modals/CreateRoutineDayModal"
import RoutineDayCard from "../../../components/cards/RoutineDayCard"
import StyledText from "../../../components/texts/StyledText"
import ToastNotification from "../../../components/notifications/ToastNotification"
import useRoutineMutation from "../../../hooks/useRoutineMutation"

type Props = {
	routine: RoutineWithDaysAndExercises
}
export default function RoutineInner({
	routine: { routine, daysAndExercises }
}: Props) {
	const { t } = useTranslation()
	const { addRoutineDay } = useUserStore()
	const { createRoutineDayMutation } = useRoutineMutation()
	const nav = useNavigation<RootStackNavigationProp>()

	const { mutate: createRoutineDay, isPending } = createRoutineDayMutation

	const [routineDayModalVisible, setRoutineDayModalVisible] = useState(false)

	function handleStartWorkout() {}

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

	function handleSeeDayHistory(day: DatabaseRoutineDay) {}

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
		>
			<StyledText type="title" align="center">
				{routine.name}
			</StyledText>

			{daysAndExercises
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

			<Button
				title={t("actions.start-workout")}
				onPress={handleStartWorkout}
				size="l"
				alignSelf
			/>

			<CreateRoutineDayModal
				isVisible={routineDayModalVisible}
				setIsVisible={setRoutineDayModalVisible}
				onCreate={handleAddRoutineDay}
				onCancel={() => setRoutineDayModalVisible(false)}
				isLoadingCreate={isPending}
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
		gap: theme.spacing.l
	}
})
