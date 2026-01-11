import useRoutineQuery, {
	GETROUTINEWITHDAYSANDEXERCISESBYID_KEY
} from "../../hooks/useRoutineQuery"
import {
	EditRoutineSchema,
	EditRoutineValues
} from "../../utils/valdiationSchemas"
import { DatabaseRoutine } from "../../types/routines"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
import { StyleSheet, View } from "react-native"
import { theme } from "../../resources/theme"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../../components/buttons/Button"
import EditRoutineInput from "../../components/inputs/EditRoutineInput"
import ToastNotification from "../../components/notifications/ToastNotification"
import useRoutineMutation from "../../hooks/useRoutineMutation"

export default function EditRoutine({
	navigation,
	route
}: RootStackScreenProps<"EditRoutine">) {
	const { t } = useTranslation()
	const { user, updateRoutine } = useUserStore()
	const { getRoutineById } = useRoutineQuery()
	const { updateRoutineMutation } = useRoutineMutation()

	const { mutate: updateDatabaseRoutine, isPending: isPendingUpdate } =
		updateRoutineMutation

	const { data, isPending: isPendingFetch } = getRoutineById(route.params.id)

	const [routine, setRoutine] = useState<DatabaseRoutine | null>(null)

	const { handleSubmit, control, setValue } = useForm<EditRoutineValues>({
		defaultValues: {
			name: routine?.name ?? "",
			description: routine?.description ?? ""
		},
		resolver: zodResolver(EditRoutineSchema)
	})

	function handleSaveChanges({ name, description }: EditRoutineValues) {
		if (
			!user ||
			!routine ||
			(name === routine?.name && description === routine.description)
		) {
			navigation.goBack()
			return
		}

		updateDatabaseRoutine(
			{ ...routine, name, description: description ?? null },
			{
				onSuccess: (newRoutine) => {
					if (!newRoutine || isPostgrestError(newRoutine)) {
						console.log("toast: ", newRoutine)
						ToastNotification({ title: newRoutine?.message })
						return
					}

					updateRoutine(newRoutine)
					invalidateQueries(
						GETROUTINEWITHDAYSANDEXERCISESBYID_KEY(newRoutine.id)
					)
					navigation.goBack()
				}
			}
		)
	}

	useEffect(() => {
		if (data && !isPostgrestError(data)) {
			setRoutine(data)
			setValue("name", data.name)
			if (data.description) setValue("description", data.description)
		}
	}, [data])

	return (
		<View style={styles.container}>
			<View>
				<EditRoutineInput name="name" control={control} />
				<EditRoutineInput name="description" control={control} />
			</View>

			<Button
				title={t("actions.save-changes")}
				onPress={handleSubmit(handleSaveChanges)}
				isLoading={isPendingFetch || isPendingUpdate}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing.s,
		paddingBottom: theme.spacing.x4l
	}
})
