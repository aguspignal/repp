import { useTranslation } from "react-i18next"

import { Card, EmptyState, ListItem, Screen, Stack, Text } from "../../components/ui"
import { useMesocycles } from "../../hooks/useMesocycles"
import { useRecentWorkouts } from "../../hooks/useWorkouts"

export const StatsScreen = () => {
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
						{t("stats.trendsHeading")}
					</Text>
					{hasWorkouts ? (
						<Card padding="l">
							<Text variant="body" color="grayDark">
								{/* TODO: trend charts */}
							</Text>
						</Card>
					) : (
						<EmptyState
							icon="trending-up-outline"
							title={t("stats.noWorkouts")}
							description={t("stats.noWorkoutsDescription")}
						/>
					)}
				</Stack>

				{hasWorkouts ? (
					<Stack gap="xs">
						<Text variant="caption" color="grayDark">
							{t("stats.recentWorkoutsHeading")}
						</Text>
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
					</Stack>
				) : null}

				<Stack gap="xs">
					<Text variant="caption" color="grayDark">
						{t("stats.pastMesocyclesHeading")}
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
							title={t("stats.noPastMesocycles")}
							description={t("stats.noPastMesocyclesDescription")}
						/>
					)}
				</Stack>
			</Stack>
		</Screen>
	)
}
