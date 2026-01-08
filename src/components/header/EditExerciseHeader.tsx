import { GETUSEREXERCISESLAZY_KEY } from "../../hooks/useExercisesQuery"
import { Header } from "@react-navigation/elements"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { navigationStyles } from "../../navigation/styles"
import { ParamListBase } from "@react-navigation/native"
import { RootStackScreenProps } from "../../navigation/params"
import { TouchableOpacity, View } from "react-native"
import { useState } from "react"
import { useUserStore } from "../../stores/useUserStore"
import ConfirmationModal from "../modals/ConfirmationModal"
import i18next from "i18next"
import MCIcon from "../icons/MCIcon"
import ToastNotification from "../notifications/ToastNotification"
import useExercisesMutation from "../../hooks/useExercisesMutation"

type Props = {
	navigation: NativeStackNavigationProp<ParamListBase, string, undefined>
	route: RootStackScreenProps<"EditExercise">["route"]
	back?: {
		title: string | undefined
		href: string | undefined
	}
}

export default function EditExerciseHeader({ navigation, route, back }: Props) {
	return (
		<Header
			title={i18next.t("actions.edit-exercise")}
			headerTitleStyle={navigationStyles.headerTitle}
			headerRight={() => (
				<HeaderRight
					navigation={navigation}
					exerciseId={route.params.id}
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
	exerciseId: number
}
function HeaderRight({ navigation, exerciseId }: HeaderRightProps) {
	const { user, removeExercise } = useUserStore()
	const { deleteExerciseMutation } = useExercisesMutation()

	const { mutate: deleteExercise, isPending } = deleteExerciseMutation

	const [modalVisible, setModalVisible] = useState(false)

	function handleDeleteExercise() {
		deleteExercise(exerciseId, {
			onSuccess: (result) => {
				if (!result || isPostgrestError(result)) {
					ToastNotification({
						title: i18next.t(
							"error-messages.trouble-deleting-exercise"
						)
					})
					return
				}

				removeExercise(exerciseId)
				invalidateQueries(GETUSEREXERCISESLAZY_KEY(user?.id ?? 0))
				navigation.reset({
					index: 0,
					routes: [{ name: "Home" }, { name: "ExerciseRepository" }]
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
				title={i18next.t("questions.sure-want-to-delete-exercise")}
				subtitle={i18next.t(
					"messages.this-will-also-delete-progressions"
				)}
				confirmText={i18next.t("actions.delete")}
				confirmColor="danger"
				onConfirm={handleDeleteExercise}
				onCancel={() => setModalVisible(false)}
				isLoadingConfirm={isPending}
			/>
		</View>
	)
}
