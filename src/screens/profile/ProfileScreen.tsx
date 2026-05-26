import { useTranslation } from "react-i18next"

import { EmptyState, ListItem, Screen, Stack, Text } from "../../components/ui"
import { useMilestones } from "../../hooks/useMilestones"

export const ProfileScreen = () => {
	const { t } = useTranslation()
	const { data: milestones } = useMilestones()

	return (
		<Screen scroll>
			<Stack gap="l">
				<Stack gap="xs">
					<Text variant="caption" color="grayDark">
						{t("profile.goalsHeading")}
					</Text>
					<EmptyState
						icon="flag-outline"
						title={t("profile.goalsEmpty")}
						description={t("profile.goalsEmptyDescription")}
					/>
				</Stack>

				<Stack gap="xs">
					<Text variant="caption" color="grayDark">
						{t("profile.milestonesHeading")}
					</Text>
					{milestones && milestones.length > 0 ? (
						<Stack gap="xxs">
							{milestones.map(m => (
								<ListItem
									key={m.id}
									title={m.title}
									description={m.achieved_at}
									leftIcon="trophy-outline"
								/>
							))}
						</Stack>
					) : (
						<EmptyState
							icon="trophy-outline"
							title={t("profile.milestonesEmpty")}
							description={t("profile.milestonesEmptyDescription")}
						/>
					)}
				</Stack>
			</Stack>
		</Screen>
	)
}
