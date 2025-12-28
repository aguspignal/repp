import { StyleProp, TouchableOpacity, ViewStyle } from "react-native"
import { TextType } from "../../types/misc"
import { theme } from "../../resources/theme"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	title: string
	onPress: () => void
	textType?: TextType
	color?: keyof typeof theme.colors
	weight?: "bold" | "medium"
	withUnderline?: boolean
	align?: "center" | "left" | "right" | undefined
	icon?: React.ComponentProps<typeof MCIcon>["name"]
	containerStyle?: StyleProp<ViewStyle>
}

export default function TextButton({
	title,
	onPress,
	textType = "boldText",
	color = "textLight",
	withUnderline = false,
	align = "left",
	icon,
	containerStyle = {},
}: Props) {
	const iconSize = 
		textType === "note" || textType === "boldNote" ? "m" 
		: textType === "text" || textType === "boldText" ? "l" 
		: textType === "subtitle" ? "xxl" 
		: "h3"

	const containerStyles: StyleProp<ViewStyle> = {
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
		borderColor: theme.colors[color as keyof typeof theme.colors],
		borderBottomWidth: withUnderline ? 1 : 0,
	}

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={[containerStyles, containerStyle]}
			onPress={onPress}
		>
			{icon ? <MCIcon name={icon} size={iconSize} color={color} /> : null}

			<StyledText type={textType} align={align} color={color}>{title}</StyledText>
		</TouchableOpacity>
	)
}
