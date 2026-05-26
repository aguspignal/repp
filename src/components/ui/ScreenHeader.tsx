import { Stack } from "./Stack"
import { Text } from "./Text"

type Props = {
	title: string
	subtitle?: string
}

export const ScreenHeader = ({ title, subtitle }: Props) => (
	<Stack gap="x3s">
		<Text variant="h3">{title}</Text>
		{subtitle ? (
			<Text variant="body" color="grayDark">
				{subtitle}
			</Text>
		) : null}
	</Stack>
)
