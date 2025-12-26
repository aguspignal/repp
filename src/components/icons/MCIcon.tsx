import { StyleProp, TextStyle } from "react-native"
import { theme } from "../../resources/theme"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"

type Props = {
	name: React.ComponentProps<typeof Icon>["name"]
	size?: keyof typeof theme.fontSize
	color?: keyof typeof theme.colors
	style?: StyleProp<TextStyle>
}

export default function MCIcon({ name, size = "l", color = "textLight", style }: Props) {
	return (
		<Icon
			name={name}
			size={theme.fontSize[size as keyof typeof theme.fontSize]}
			color={theme.colors[color as keyof typeof theme.colors]}
			style={style}
		/>
	)
}
