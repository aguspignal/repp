import { Card } from "./Card"
import { Icon, type IconName } from "./Icon"
import { Stack } from "./Stack"
import { Text } from "./Text"

type Props = {
	icon?: IconName
	title: string
	description?: string
}

export const EmptyState = ({ icon, title, description }: Props) => (
	<Card padding="l">
		<Stack align="center" justify="center" gap="xs">
			{icon ? <Icon name={icon} color="grayDark" size={32} /> : null}
			<Text variant="subtitle" align="center">
				{title}
			</Text>
			{description ? (
				<Text variant="bodySmall" color="grayDark" align="center">
					{description}
				</Text>
			) : null}
		</Stack>
	</Card>
)
