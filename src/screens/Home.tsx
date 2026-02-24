import {
	FlatList,
	RefreshControl,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View
} from "react-native"
import { isPostgrestError } from "../utils/queriesHelpers"
import { RootStackScreenProps } from "../navigation/params"
import { theme } from "../resources/theme"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../stores/useUserStore"
import Button from "../components/buttons/Button"
import CreateRoutineModal from "../components/modals/CreateRoutineModal"
import MCIcon from "../components/icons/MCIcon"
import RoutineCard from "../components/cards/RoutineCard"
import StartWorkoutModal from "../components/modals/SelectRoutineDayModal"
import StyledText from "../components/texts/StyledText"
import TextButton from "../components/buttons/TextButton"
import ToastNotification from "../components/notifications/ToastNotification"
import useRoutineMutation from "../hooks/useRoutineMutation"
import useRoutineQuery from "../hooks/useRoutineQuery"
import SelectRoutineDayModal from "../components/modals/SelectRoutineDayModal"

export default function Home({ navigation }: RootStackScreenProps<"Home">) {
	const { t } = useTranslation()
	const { user, routines, loadRoutines, addRoutineWithDaysAndSchedule } =
		useUserStore()
	const { getUserRoutinesWithDaysLazy } = useRoutineQuery()
	const { createRoutineMutation } = useRoutineMutation()

	const {
		refetch: fetchRoutines,
		data: fetchedRoutines,
		isFetching: isFetchingRoutines,
		isLoading: isLoadingRoutines
	} = getUserRoutinesWithDaysLazy(user?.id)

	const { mutate: createRoutine, isPending: isPendingCreate } =
		createRoutineMutation

	const [createRoutineModalVisible, setCreateRoutineModalVisible] =
		useState(false)
	const [startWorkoutModalVisible, setStartWorkoutModalVisible] =
		useState(false)
	const [isRefreshing, setIsRefreshing] = useState(false)

	function handleCreateRoutine(routineName: string) {
		if (!user) return

		createRoutine(
			{ userId: user.id, name: routineName, description: null },
			{
				onSuccess: (routine) => {
					if (!routine || isPostgrestError(routine)) {
						ToastNotification({
							title: t("error-messages.trouble-getting-routine")
						})
						return
					}

					addRoutineWithDaysAndSchedule({ routine, days: [] })
					setCreateRoutineModalVisible(false)
					navigation.navigate("Routine", { id: routine.id })
				}
			}
		)
	}

	function handleStartWorkout(dayId: number) {
		setStartWorkoutModalVisible(false)
		navigation.navigate("Workout", { dayId })
	}

	function goToExerciseRepository() {
		navigation.navigate("ExerciseRepository", {
			editingRoutineDayId: undefined
		})
	}

	function handleRefresh() {
		try {
			setIsRefreshing(true)
			fetchRoutines()
		} catch (e) {
			console.log(e)
		} finally {
			setIsRefreshing(false)
		}
	}

	useEffect(() => {
		if (fetchedRoutines && !isPostgrestError(fetchedRoutines))
			loadRoutines(fetchedRoutines)
	}, [fetchedRoutines])

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
			refreshControl={
				<RefreshControl
					refreshing={
						isRefreshing || isFetchingRoutines || isLoadingRoutines
					}
					onRefresh={handleRefresh}
				/>
			}
		>
			{routines.length > 0 &&
			routines.some((r) => r.routine.status === "active") ? (
				<View style={styles.activeRoutineContainer}>
					<RoutineCard
						routine={
							routines.filter(
								(r) => r.routine.status === "active"
							)[0]
						}
					/>
					<Button
						title={t("actions.start-workout")}
						onPress={() => setStartWorkoutModalVisible(true)}
						alignSelf
						size="l"
					/>
				</View>
			) : (
				<StyledText type="boldNote" color="grayDark" align="center">
					{t(
						"messages.tip-mark-routine-active-to-start-workingout-faster"
					)}
				</StyledText>
			)}

			{routines.length === 0 ? (
				<View style={styles.noRoutinesContainer}>
					<MCIcon name="dumbbell" size={"h1"} color="grayDark" />

					<StyledText type="subtitle">
						{t("messages.you-dont-have-routines-yet")}
					</StyledText>

					<StyledText type="boldNote">
						{t("messages.create-routine-to-start-workingout")}
					</StyledText>
				</View>
			) : (
				<View style={styles.myRoutinesContainer}>
					<View style={styles.myRoutinesAndAddBtn}>
						<StyledText type="subtitle">
							{t("titles.my-routines")}
						</StyledText>

						<TextButton
							title={t("actions.add")}
							onPress={() => setCreateRoutineModalVisible(true)}
							icon="plus"
							color="primary"
							textType="subtitle"
						/>
					</View>

					<FlatList
						data={routines.filter(
							(r) => r.routine.status !== "active"
						)}
						renderItem={({ item: routine }) => (
							<RoutineCard
								routine={routine}
								key={routine.routine.id}
							/>
						)}
						contentContainerStyle={styles.routinesList}
						horizontal
					/>
				</View>
			)}

			<TouchableOpacity
				onPress={goToExerciseRepository}
				style={styles.exerciseRepoCard}
			>
				<StyledText type="boldText">
					{t("titles.exercise-repository")}
				</StyledText>

				<MCIcon name="chevron-right" color="grayDark" />
			</TouchableOpacity>

			<CreateRoutineModal
				isVisible={createRoutineModalVisible}
				setIsVisible={setCreateRoutineModalVisible}
				onCreate={handleCreateRoutine}
				onCancel={() => setCreateRoutineModalVisible(false)}
				isLoadingCreate={isPendingCreate}
			/>

			<SelectRoutineDayModal
				isVisible={startWorkoutModalVisible}
				setIsVisible={setStartWorkoutModalVisible}
				title={t("actions.choose-training-day-to-start-working-out")}
				onSelect={handleStartWorkout}
				routineId={
					routines.find((r) => r.routine.status === "active")?.routine
						.id
				}
			/>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack
	},
	contentContainer: {
		gap: theme.spacing.xxl,
		paddingHorizontal: theme.spacing.s
	},
	activeRoutineContainer: {
		gap: theme.spacing.s
	},
	noRoutinesContainer: {
		alignItems: "center",
		gap: theme.spacing.s
	},
	myRoutinesContainer: {
		gap: theme.spacing.s
	},
	myRoutinesAndAddBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	routinesList: {
		gap: theme.spacing.xl
	},
	exerciseRepoCard: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.s,
		paddingVertical: theme.spacing.xs,
		backgroundColor: theme.colors.backgroundGray,
		borderRadius: theme.spacing.xxs
	}
})
