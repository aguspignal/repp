import { useTranslation } from "react-i18next"

import { Button, Card, EmptyState, Screen, Stack, Text } from "../../components/ui"
import { useActiveMesocycle } from "../../hooks/useMesocycles"

const computeWeekFromStart = (startDate: string): number => {
	const start = new Date(startDate).getTime()
	const now = Date.now()
	if (Number.isNaN(start) || now < start) return 1
	const days = Math.floor((now - start) / (1000 * 60 * 60 * 24))
	return Math.floor(days / 7) + 1
}

export const HomeScreen = () => {
	const { t } = useTranslation()
	const { data: mesocycle, isLoading } = useActiveMesocycle()

	const currentWeek = mesocycle ? computeWeekFromStart(mesocycle.start_date) : null

	return (
		<Screen scroll>
			<Stack gap="l">
				{isLoading ? null : mesocycle ? (
					<Card padding="l">
						<Stack gap="xs">
							<Text variant="caption" color="grayDark">
								{t("home.activeMesocycleHeading")}
							</Text>
							<Text variant="h3">{mesocycle.title}</Text>
							{currentWeek != null ? (
								<Text variant="bodySmall" color="grayDark">
									{mesocycle.duration_weeks
										? t("home.currentWeek", {
												week: Math.min(
													currentWeek,
													mesocycle.duration_weeks,
												),
												total: mesocycle.duration_weeks,
											})
										: t("home.currentWeekShort", { week: currentWeek })}
								</Text>
							) : null}
							{mesocycle.note ? (
								<Text variant="body" color="grayDark">
									{mesocycle.note}
								</Text>
							) : null}
						</Stack>
					</Card>
				) : (
					<EmptyState
						icon="calendar-outline"
						title={t("home.noActiveMesocycle")}
						description={t("home.noActiveMesocycleDescription")}
					/>
				)}

				<Button
					title={t("home.startWorkout")}
					fullWidth
					size="lg"
					disabled={!mesocycle}
					onPress={() => {
						/* TODO: navigate to active workout flow */
					}}
				/>

				{!mesocycle ? (
					<Button
						title={t("home.planMesocycle")}
						variant="ghost"
						fullWidth
						onPress={() => {
							/* TODO: navigate to mesocycle planner */
						}}
					/>
				) : null}
			</Stack>
		</Screen>
	)
}
