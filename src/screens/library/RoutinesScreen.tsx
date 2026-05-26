import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"

import { Button, EmptyState, ListItem, Screen, Stack } from "../../components/ui"
import { useRoutines } from "../../hooks/useRoutines"

export const RoutinesScreen = () => {
	const { t } = useTranslation()
	const { data: routines, isLoading } = useRoutines()

	if (isLoading) return <Screen />

	if (!routines || routines.length === 0) {
		return (
			<Screen>
				<Stack gap="l">
					<EmptyState
						icon="calendar-outline"
						title={t("routinesScreen.empty")}
						description={t("routinesScreen.emptyDescription")}
					/>
					<Button title={t("routinesScreen.add")} fullWidth onPress={() => {}} />
				</Stack>
			</Screen>
		)
	}

	return (
		<Screen padding="s">
			<Stack gap="s" flex={1}>
				<FlatList
					data={routines}
					keyExtractor={r => String(r.id)}
					contentContainerStyle={{ gap: 8 }}
					renderItem={({ item }) => (
						<ListItem
							title={item.name}
							description={item.description ?? undefined}
							leftIcon="calendar-outline"
							onPress={() => {
								/* TODO: navigate to RoutineDetail */
							}}
						/>
					)}
				/>
				<Button title={t("routinesScreen.add")} fullWidth onPress={() => {}} />
			</Stack>
		</Screen>
	)
}
