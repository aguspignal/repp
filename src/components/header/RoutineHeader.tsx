import { Header } from "@react-navigation/elements"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { navigationStyles } from "../../navigation/styles"
import { ParamListBase } from "@react-navigation/native"
import { TouchableOpacity, View } from "react-native"
import MCIcon from "../icons/MCIcon"
import { useUserStore } from "../../stores/useUserStore"
import { RootStackScreenProps } from "../../navigation/params"
import useRoutineMutation from "../../hooks/useRoutineMutation"
import { isPostgrestError } from "../../utils/queriesHelpers"
import ToastNotification from "../notifications/ToastNotification"

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
	const { user, routines, updateRoutine, markActiveRoutinesAsDraft } =
		useUserStore()
	const { markRoutineAsActiveMutation, markRoutineAsDraftMutation } =
		useRoutineMutation()

	const { mutate: markRoutineAsActive, isPending: isPendingActive } =
		markRoutineAsActiveMutation

	const { mutate: markRoutineAsDraft, isPending: isPendingDraft } =
		markRoutineAsDraftMutation

	const thisRoutine = routines.find(
		(r) => r.routine.id === routineId
	)?.routine

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
		</View>
	)
}
