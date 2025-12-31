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
import StyledText from "../components/texts/StyledText"
import ToastNotification from "../components/notifications/ToastNotification"
import useRoutineMutation from "../hooks/useRoutineMutation"
import useRoutineQuery from "../hooks/useRoutineQuery"
import RoutineCard from "../components/cards/RoutineCard"

export default function Home({ navigation }: RootStackScreenProps<"Home">) {
	const { t } = useTranslation()
	const { user, routines, loadRoutines, addRoutine } = useUserStore()
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

	const [isModalVisible, setIsModalVisible] = useState(false)
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

					addRoutine({ routine, days: [] })
					navigation.navigate("Routine", { id: routine.id })
				}
			}
		)
	}

	function goToExerciseRepository() {
		navigation.navigate("ExerciseRepository")
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
					<StyledText type="subtitle">
						{t("titles.my-routines")}
					</StyledText>

					<FlatList
						data={routines}
						renderItem={({ item: routine }) => (
							<RoutineCard
								routine={routine}
								key={routine.routine.id}
							/>
						)}
						horizontal
					/>
				</View>
			)}

			<Button
				title={t("actions.create-new-routine")}
				onPress={() => setIsModalVisible(true)}
				size="l"
				alignSelf
			/>

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
				isVisible={isModalVisible}
				setIsVisible={setIsModalVisible}
				onCreate={handleCreateRoutine}
				onCancel={() => setIsModalVisible(false)}
				isLoadingCreate={isPendingCreate}
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
		gap: theme.spacing.xl,
		paddingHorizontal: theme.spacing.s
	},
	noRoutinesContainer: {
		alignItems: "center",
		gap: theme.spacing.s
	},
	myRoutinesContainer: {
		gap: theme.spacing.s
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
