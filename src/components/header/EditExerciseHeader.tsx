import { GETUSEREXERCISESLAZY_KEY } from "../../hooks/useExercisesQuery"
import { Header } from "@react-navigation/elements"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { navigationStyles } from "../../navigation/styles"
import { ParamListBase } from "@react-navigation/native"
import { RootStackScreenProps } from "../../navigation/params"
import { TouchableOpacity } from "react-native"
import { useUserStore } from "../../stores/useUserStore"
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
		<TouchableOpacity
			onPress={handleDeleteExercise}
			disabled={isPending}
			style={navigationStyles.headerRightContainer}
		>
			<MCIcon name="trash-can" style={navigationStyles.headerIcon} />
		</TouchableOpacity>
	)
}
