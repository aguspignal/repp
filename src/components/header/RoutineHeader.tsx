import { Header } from "@react-navigation/elements"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { navigationStyles } from "../../navigation/styles"
import { ParamListBase } from "@react-navigation/native"
import { RootStackScreenProps } from "../../navigation/params"
import { TouchableOpacity, View } from "react-native"
import { useUserStore } from "../../stores/useUserStore"
import MCIcon from "../icons/MCIcon"
import ToastNotification from "../notifications/ToastNotification"
import useRoutineMutation from "../../hooks/useRoutineMutation"
import { useState } from "react"
import ConfirmationModal from "../modals/ConfirmationModal"
import { useTranslation } from "react-i18next"
import { GETUSERROUTINESWITHDAYSLAZY_KEY } from "../../hooks/useRoutineQuery"

type Props = {
	navigation: NativeStackNavigationProp<ParamListBase, string, undefined>
	route: RootStackScreenProps<"Routine">["route"]
	back?: {
		title: string | undefined
		href: string | undefined
	}
}

export default function RoutineHeader({ navigation, route, back }: Props) {
	return (
		<Header
			title=""
			headerTitleStyle={navigationStyles.headerTitle}
			headerRight={() => (
				<HeaderRight
					navigation={navigation}
					routineId={route.params.id}
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
	routineId: number
}
function HeaderRight({ navigation, routineId }: HeaderRightProps) {
	const { t } = useTranslation()
	const {
		user,
		routines,
		updateRoutine,
		removeRoutine,
		markActiveRoutinesAsDraft
	} = useUserStore()
	const {
		markRoutineAsActiveMutation,
		markRoutineAsDraftMutation,
		deleteAllRoutineDataMutation
	} = useRoutineMutation()

	const { mutate: markRoutineAsActive, isPending: isPendingActive } =
		markRoutineAsActiveMutation

	const { mutate: markRoutineAsDraft, isPending: isPendingDraft } =
		markRoutineAsDraftMutation
	const { mutate: deleteAllRoutineData, isPending: isPendingDelete } =
		deleteAllRoutineDataMutation

	const thisRoutine = routines.find(
		(r) => r.routine.id === routineId
	)?.routine

	const [modalVisible, setModalVisible] = useState(false)

	function handleMarkAsActive() {
		if (!user || !thisRoutine) return
		markRoutineAsActive(
			{ userId: user.id, routineId: thisRoutine.id },
			{
				onSuccess: (result) => {
					if (!result || isPostgrestError(result)) {
						ToastNotification({})
						return
					}

					markActiveRoutinesAsDraft()
					updateRoutine({ ...thisRoutine, status: "active" })
				}
			}
		)
	}

	function handleMarkAsDraft() {
		if (!thisRoutine) return
		markRoutineAsDraft(thisRoutine.id, {
			onSuccess: (result) => {
				if (!result || isPostgrestError(result)) {
					ToastNotification({})
					return
				}

				markActiveRoutinesAsDraft()
			}
		})
	}

	function handleDeleteRoutine() {
		if (!thisRoutine || !user) return
		deleteAllRoutineData(thisRoutine.id, {
			onSuccess: (result) => {
				if (isPostgrestError(result)) {
					ToastNotification({})
					return
				}
				removeRoutine(thisRoutine.id)
				invalidateQueries(GETUSERROUTINESWITHDAYSLAZY_KEY(user.id))
			}
		})
		setModalVisible(false)
		navigation.reset({
			index: 0,
			routes: [{ name: "Home" }]
		})
	}

	return (
		<View style={navigationStyles.headerRightContainer}>
			<TouchableOpacity
				onPress={() =>
					navigation.navigate("EditRoutine", { id: routineId })
				}
			>
				<MCIcon name="rename" style={navigationStyles.headerIcon} />
			</TouchableOpacity>

			<TouchableOpacity
				onPress={
					thisRoutine?.status === "active"
						? handleMarkAsDraft
						: handleMarkAsActive
				}
				disabled={isPendingDraft || isPendingActive}
			>
				<MCIcon
					name={
						thisRoutine?.status === "active"
							? "heart"
							: "heart-outline"
					}
					style={navigationStyles.headerIcon}
				/>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => setModalVisible(true)}>
				<MCIcon name="trash-can" style={navigationStyles.headerIcon} />
			</TouchableOpacity>

			<ConfirmationModal
				isVisible={modalVisible}
				setIsVisible={setModalVisible}
				title={t("questions.sure-want-to-delete-routine")}
				subtitle={t(
					"messages.this-will-delete-routine-data-cannot-be-undone"
				)}
				onConfirm={handleDeleteRoutine}
				confirmText={t("actions.delete")}
				confirmColor="danger"
				isLoadingConfirm={isPendingDelete}
			/>
		</View>
	)
}
