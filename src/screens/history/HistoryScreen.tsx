import { useTranslation } from "react-i18next"

import { EmptyState, ListItem, Screen, Stack, Text } from "../../components/ui"
import { useMesocycles } from "../../hooks/useMesocycles"
import { useRecentWorkouts } from "../../hooks/useWorkouts"

export const HistoryScreen = () => {
	const { t } = useTranslation()
	const { data: recentWorkouts } = useRecentWorkouts(5)
	const { data: mesocycles } = useMesocycles()

	const pastMesocycles =
		mesocycles?.filter(m => m.status === "completed" || m.status === "abandoned") ?? []

	const hasWorkouts = (recentWorkouts?.length ?? 0) > 0

	return (
		<Screen scroll>
			<Stack gap="l">
				<Stack gap="xs">
					<Text variant="caption" color="grayDark">
						{t("history.recentWorkoutsHeading")}
					</Text>
					{hasWorkouts ? (
						<Stack gap="xxs">
							{recentWorkouts!.map(w => (
								<ListItem
									key={w.id}
									title={new Date(w.date).toLocaleDateString()}
									description={w.note ?? undefined}
									leftIcon="flame-outline"
									onPress={() => {
										/* TODO: navigate to WorkoutDetail */
									}}
								/>
							))}
						</Stack>
					) : (
						<EmptyState
							icon="time-outline"
							title={t("history.noWorkouts")}
							description={t("history.noWorkoutsDescription")}
						/>
					)}
				</Stack>

				<Stack gap="xs">
					<Text variant="caption" color="grayDark">
						{t("history.pastMesocyclesHeading")}
					</Text>
					{pastMesocycles.length > 0 ? (
						<Stack gap="xxs">
							{pastMesocycles.map(m => (
								<ListItem
									key={m.id}
									title={m.title}
									description={m.start_date}
									leftIcon="calendar-outline"
								/>
							))}
						</Stack>
					) : (
						<EmptyState
							title={t("history.noPastMesocycles")}
							description={t("history.noPastMesocyclesDescription")}
						/>
					)}
				</Stack>
			</Stack>
		</Screen>
	)
}
