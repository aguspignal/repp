import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"

import { ExerciseCard } from "../../components/exercises/ExerciseCard"
import { Button, EmptyState, Screen, Stack } from "../../components/ui"
import { useExercises } from "../../hooks/useExercises"
import { theme } from "../../theme"

export const ExercisesScreen = () => {
	const { t } = useTranslation()
	const navigation = useNavigation()
	const { data: exercises, isLoading } = useExercises()

	const goCreate = () => navigation.navigate("ExerciseCreate")
	const openExercise = (id: number) => navigation.navigate("ExerciseDetail", { exerciseId: id })

	if (isLoading) return <Screen padding="x3s" />

	if (!exercises || exercises.length === 0) {
		return (
			<Screen>
				<Stack gap="l">
					<EmptyState
						icon="barbell-outline"
						title={t("exercisesScreen.empty")}
						description={t("exercisesScreen.emptyDescription")}
					/>
					<Button title={t("exercisesScreen.add")} fullWidth onPress={goCreate} />
				</Stack>
			</Screen>
		)
	}

	return (
		<Screen padding="x3s">
			<Stack gap="xxs" flex={1}>
				<FlatList
					data={exercises}
					keyExtractor={e => String(e.id)}
					contentContainerStyle={{
						gap: theme.spacing.xxs,
						paddingHorizontal: theme.spacing.xxs,
						paddingBottom: theme.spacing.s,
					}}
					renderItem={({ item }) => (
						<ExerciseCard exercise={item} onPress={() => openExercise(item.id)} />
					)}
				/>
				<Button title={t("exercisesScreen.add")} fullWidth onPress={goCreate} />
			</Stack>
		</Screen>
	)
}
