import { Screen, Text } from "../components/ui"

type Props = { title: string }

export const PlaceholderScreen = ({ title }: Props) => (
	<Screen>
		<Text variant="h3" align="center">
			{title}
		</Text>
	</Screen>
)
