import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Alert, FlatList, View } from "react-native"

import { Banner, Button, EmptyState, Screen, Stack, Text } from "../../components/ui"
import { useDeletedExercises, useRestoreExercise } from "../../hooks/useExercises"
import { theme } from "../../theme"
import type { Exercise } from "../../types/db"

const formatDeletedAt = (iso: string | null, locale: string) => {
	if (!iso) return null
	try {
		return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso))
	} catch {
		return iso.slice(0, 10)
	}
}

export const DeletedExercisesScreen = () => {
	const { t, i18n } = useTranslation()
	const { data: exercises, isLoading, error } = useDeletedExercises()
	const restoreExercise = useRestoreExercise()

	const confirmRestore = useCallback(
		(exercise: Exercise) => {
			Alert.alert(
				t("deletedExercises.restoreConfirmTitle"),
				t("deletedExercises.restoreConfirmMessage"),
				[
					{ text: t("common.cancel"), style: "cancel" },
					{
						text: t("deletedExercises.restore"),
						onPress: async () => {
							try {
								await restoreExercise.mutateAsync(exercise.id)
							} catch (err) {
								Alert.alert(
									t("deletedExercises.restoreError"),
									err instanceof Error ? err.message : "",
								)
							}
						},
					},
				],
			)
		},
		[restoreExercise, t],
	)

	if (isLoading) {
		return (
			<Screen>
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
					<ActivityIndicator />
				</View>
			</Screen>
		)
	}

	if (error) {
		return (
			<Screen>
				<Banner tone="error" message={t("exerciseForm.loadFailed")} />
			</Screen>
		)
	}

	if (!exercises || exercises.length === 0) {
		return (
			<Screen>
				<EmptyState
					icon="trash-outline"
					title={t("deletedExercises.empty")}
					description={t("deletedExercises.emptyDescription")}
				/>
			</Screen>
		)
	}

	return (
		<Screen padding="s">
			<FlatList
				data={exercises}
				keyExtractor={e => String(e.id)}
				contentContainerStyle={{ gap: theme.spacing.xs }}
				renderItem={({ item }) => {
					const deletedLabel = formatDeletedAt(item.deleted_at, i18n.language)
					return (
						<Stack
							gap="xs"
							style={{
								padding: theme.spacing.s,
								borderRadius: theme.radii.m,
								backgroundColor: theme.colors.backgroundDark,
							}}
						>
							<Stack gap="x3s">
								<Text variant="subtitle">{item.name}</Text>
								{deletedLabel ? (
									<Text variant="caption" color="grayDark">
										{t("deletedExercises.deletedOn", { date: deletedLabel })}
									</Text>
								) : null}
							</Stack>
							<Button
								title={t("deletedExercises.restore")}
								size="sm"
								variant="secondary"
								loading={
									restoreExercise.isPending &&
									restoreExercise.variables === item.id
								}
								onPress={() => confirmRestore(item)}
							/>
						</Stack>
					)
				}}
			/>
		</Screen>
	)
}
