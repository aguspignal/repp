import { GETROUTINEWITHDAYSANDEXERCISESBYID_KEY } from "../../hooks/useRoutineQuery"
import { Header } from "@react-navigation/elements"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { navigationStyles } from "../../navigation/styles"
import { ParamListBase } from "@react-navigation/native"
import { RoutinesTabScreenProps } from "../../navigation/params"
import { TouchableOpacity, View } from "react-native"
import { useState } from "react"
import { useUserStore } from "../../stores/useUserStore"
import ConfirmationModal from "../modals/ConfirmationModal"
import i18next from "i18next"
import MCIcon from "../icons/MCIcon"
import ToastNotification from "../notifications/ToastNotification"
import useRoutineMutation from "../../hooks/useRoutineMutation"

type Props = {
	navigation: NativeStackNavigationProp<ParamListBase, string, undefined>
	route: RoutinesTabScreenProps<"EditRoutineDay">["route"]
	back?: {
		title: string | undefined
		href: string | undefined
	}
}

export default function EditRoutineDayHeader({
	navigation,
	route,
	back
}: Props) {
	return (
		<Header
			title={i18next.t("actions.edit-routine-day")}
			headerTitleStyle={navigationStyles.headerTitle}
			headerRight={() => (
				<HeaderRight
					navigation={navigation}
					routineDayId={route.params.id}
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
	routineDayId: number
}
function HeaderRight({ navigation, routineDayId }: HeaderRightProps) {
	const { getRoutineByDayId } = useUserStore()
	const { deleteRoutineDayMutation } = useRoutineMutation()

	const { mutate: deleteDay, isPending } = deleteRoutineDayMutation

	const [modalVisible, setModalVisible] = useState(false)

	function handleDeleteDay() {
		deleteDay(routineDayId, {
			onSuccess: (result) => {
				if (!result || isPostgrestError(result)) {
					ToastNotification({
						title: i18next.t(
							"error-messages.trouble-deleting-routine-day"
						)
					})
					return
				}

				const routine = getRoutineByDayId(routineDayId)
				invalidateQueries(
					GETROUTINEWITHDAYSANDEXERCISESBYID_KEY(routine.id)
				)
				navigation.reset({
					index: 0,
					routes: [
						{ name: "Home" },
						{ name: "Routine", params: { id: routine.id } }
					]
				})
			}
		})
	}

	return (
		<View style={navigationStyles.headerRightContainer}>
			<TouchableOpacity
				onPress={() => setModalVisible(true)}
				disabled={isPending}
			>
				<MCIcon name="trash-can" style={navigationStyles.headerIcon} />
			</TouchableOpacity>

			<ConfirmationModal
				isVisible={modalVisible}
				setIsVisible={setModalVisible}
				title={i18next.t("questions.sure-want-to-delete-day")}
				subtitle={i18next.t(
					"messages.workouts-related-to-day-will-be-saved"
				)}
				confirmText={i18next.t("actions.delete")}
				confirmColor="danger"
				onConfirm={handleDeleteDay}
				onCancel={() => setModalVisible(false)}
				isLoadingConfirm={isPending}
			/>
		</View>
	)
}
