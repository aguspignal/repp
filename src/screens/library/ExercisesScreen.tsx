import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"

import { Button, EmptyState, ListItem, Screen, Stack } from "../../components/ui"
import { useExercises } from "../../hooks/useExercises"

export const ExercisesScreen = () => {
	const { t } = useTranslation()
	const { data: exercises, isLoading } = useExercises()

	if (isLoading) return <Screen />

	if (!exercises || exercises.length === 0) {
		return (
			<Screen>
				<Stack gap="l">
					<EmptyState
						icon="barbell-outline"
						title={t("exercisesScreen.empty")}
						description={t("exercisesScreen.emptyDescription")}
					/>
					<Button title={t("exercisesScreen.add")} fullWidth onPress={() => {}} />
				</Stack>
			</Screen>
		)
	}

	return (
		<Screen padding="s">
			<Stack gap="s" flex={1}>
				<FlatList
					data={exercises}
					keyExtractor={e => String(e.id)}
					contentContainerStyle={{ gap: 8 }}
					renderItem={({ item }) => (
						<ListItem
							title={item.name}
							description={item.description ?? undefined}
							leftIcon="barbell-outline"
							onPress={() => {
								/* TODO: navigate to ExerciseDetail */
							}}
						/>
					)}
				/>
				<Button title={t("exercisesScreen.add")} fullWidth onPress={() => {}} />
			</Stack>
		</Screen>
	)
}
