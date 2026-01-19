import { Header } from "@react-navigation/elements"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { navigationStyles } from "../../navigation/styles"
import { ParamListBase } from "@react-navigation/native"
import { RootStackScreenProps } from "../../navigation/params"
import { TouchableOpacity, View } from "react-native"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import ConfirmationModal from "../modals/ConfirmationModal"
import MCIcon from "../icons/MCIcon"
import useRoutineMutation from "../../hooks/useRoutineMutation"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import ToastNotification from "../notifications/ToastNotification"

type Props = {
	navigation: NativeStackNavigationProp<ParamListBase, string, undefined>
	route: RootStackScreenProps<"EditWorkout">["route"]
	back?: {
		title: string | undefined
		href: string | undefined
	}
}

export default function EditWorkoutHeader({ navigation, route, back }: Props) {
	const { t } = useTranslation()
	const { routines } = useUserStore()

	const thisDay = routines
		.find((r) => r.days.some((d) => d.id === route.params.dayId))
		?.days.find((d) => d.id === route.params.dayId)

	return (
		<Header
			title={t("titles.(dayName)-workout", {
				dayName: thisDay?.name || t("attributes.new")
			})}
			headerTitleStyle={navigationStyles.headerTitle}
			headerRight={() => (
				<HeaderRight
					navigation={navigation}
					dayId={route.params.dayId}
					workoutId={route.params.wId}
				/>
			)}
			headerStyle={navigationStyles.headerBackground}
			headerShadowVisible={false}
			headerTintColor={navigationStyles.headerTextColor.color}
			back={back}
		/>
	)
}

type HeaderRightProps = {
	navigation: NativeStackNavigationProp<ParamListBase, string, undefined>
	dayId: number
	workoutId: number
}
function HeaderRight({ navigation, dayId, workoutId }: HeaderRightProps) {
	const { t } = useTranslation()
	const { routines } = useUserStore()
	const { deleteWorkoutMutation } = useRoutineMutation()

	const { mutate: deleteWorkout, isPending } = deleteWorkoutMutation

	const [confirmationModalVisible, setConfirmationModalVisible] =
		useState(false)

	function handleDeleteWorkout() {
		deleteWorkout(workoutId, {
			onSuccess: (result) => {
				console.log(result)
				if (!result || isPostgrestError(result)) {
					ToastNotification({
						title: isPostgrestError(result)
							? result.message
							: undefined
					})
					return
				}

				navigation.reset({
					index: 0,
					routes: [
						{ name: "Home" },
						{
							name: "Routine",
							params: {
								id: routines.find((r) =>
									r.days.some((d) => d.id === dayId)
								)?.routine.id
							}
						},
						{
							name: "RoutineDayHistory",
							params: { id: dayId, canEdit: true }
						}
					]
				})
			}
		})
	}

	return (
		<View style={navigationStyles.headerRightContainer}>
			<TouchableOpacity
				onPress={() =>
					navigation.navigate("RoutineDayHistory", {
						id: dayId,
						canEdit: false
					})
				}
				style={navigationStyles.headerRightContainer}
			>
				<MCIcon name="history" style={navigationStyles.headerIcon} />
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => setConfirmationModalVisible(true)}
				style={navigationStyles.headerRightContainer}
			>
				<MCIcon name="trash-can" style={navigationStyles.headerIcon} />
			</TouchableOpacity>

			<ConfirmationModal
				isVisible={confirmationModalVisible}
				setIsVisible={setConfirmationModalVisible}
				title={t("questions.sure-want-to-delete-workout")}
				onConfirm={handleDeleteWorkout}
				isLoadingConfirm={isPending}
			/>
		</View>
	)
}
