import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Alert, Pressable, View } from "react-native"

import { Banner, Icon, Screen } from "../../components/ui"
import {
	ExerciseForm,
	type DraftProgression,
	type ExerciseFormInitial,
	type ExerciseFormValues,
} from "../../components/exercises/ExerciseForm"
import {
	useDeleteExercise,
	useExercise,
	useUpdateExerciseWithProgressions,
} from "../../hooks/useExercises"
import { useProgressions } from "../../hooks/useProgressions"
import type { RootStackParamList } from "../../navigation/types"

type Props = NativeStackScreenProps<RootStackParamList, "ExerciseDetail">

const tempId = () => Math.random().toString(36).slice(2, 10)

export const ExerciseDetailScreen = ({ route, navigation }: Props) => {
	const { t } = useTranslation()
	const { exerciseId } = route.params
	const { data: exercise, isLoading: exLoading, error: exError } = useExercise(exerciseId)
	const {
		data: progressions,
		isLoading: progLoading,
		error: progError,
	} = useProgressions(exerciseId)
	const updateExercise = useUpdateExerciseWithProgressions()
	const deleteExercise = useDeleteExercise()
	const [formError, setFormError] = useState<string | null>(null)

	const confirmDelete = useCallback(() => {
		Alert.alert(t("exerciseForm.deleteConfirmTitle"), t("exerciseForm.deleteConfirmMessage"), [
			{ text: t("common.cancel"), style: "cancel" },
			{
				text: t("exerciseForm.deleteAction"),
				style: "destructive",
				onPress: async () => {
					setFormError(null)
					try {
						await deleteExercise.mutateAsync(exerciseId)
						navigation.goBack()
					} catch (err) {
						setFormError(
							err instanceof Error ? err.message : t("exerciseForm.deleteError"),
						)
					}
				},
			},
		])
	}, [deleteExercise, exerciseId, navigation, t])

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Pressable
					onPress={confirmDelete}
					hitSlop={10}
					disabled={deleteExercise.isPending}
					accessibilityRole="button"
					accessibilityLabel={t("exerciseForm.delete")}
				>
					<Icon name="trash-outline" color="danger" size={22} />
				</Pressable>
			),
		})
	}, [navigation, confirmDelete, deleteExercise.isPending, t])

	const initial: ExerciseFormInitial | null = useMemo(() => {
		if (!exercise) return null
		const progressionDrafts: DraftProgression[] = (progressions ?? [])
			.slice()
			.sort((a, b) => b.order - a.order)
			.map(p => ({
				id: tempId(),
				existingId: p.id,
				name: p.name,
			}))
		return {
			name: exercise.name,
			description: exercise.description,
			type: exercise.type,
			movePattern: exercise.move_pattern,
			isIsometric: exercise.is_isometric,
			isWeighted: exercise.is_weighted,
			progressions: progressionDrafts,
		}
	}, [exercise, progressions])

	const onSubmit = async (values: ExerciseFormValues) => {
		setFormError(null)
		try {
			await updateExercise.mutateAsync({
				id: exerciseId,
				patch: {
					name: values.name,
					description: values.description,
					move_pattern: values.movePattern,
					is_isometric: values.isIsometric,
					is_weighted: values.isWeighted,
				},
				progressions: values.progressions,
			})
			navigation.goBack()
		} catch (err) {
			setFormError(err instanceof Error ? err.message : t("exerciseForm.errors.generic"))
		}
	}

	if (exLoading || progLoading) {
		return (
			<Screen edges={["bottom"]}>
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
					<ActivityIndicator />
				</View>
			</Screen>
		)
	}

	if (exError || progError || !exercise || !initial) {
		return (
			<Screen edges={["bottom"]}>
				<Banner tone="error" message={t("exerciseForm.loadFailed")} />
			</Screen>
		)
	}

	return (
		<Screen padding="s" edges={["bottom"]}>
			<ExerciseForm
				initial={initial}
				submitLabel={t("exerciseForm.save")}
				submitting={updateExercise.isPending}
				formError={formError}
				lockType
				onSubmit={onSubmit}
			/>
		</Screen>
	)
}
