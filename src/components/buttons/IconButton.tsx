import { ActivityIndicator, StyleProp, TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { theme } from "../../resources/theme"
import MCIcon from "../icons/MCIcon"

type Props = {
	icon: React.ComponentProps<typeof MCIcon>["name"]
	onPress: () => void
	size?: "xs" | "s" | "m" | "l" | "xl"
	color?: keyof typeof theme.colors
	isDisabled?: boolean
	isBordered?: boolean
	isLoading?: boolean
	style?: StyleProp<ViewStyle>
}

export default function IconButton({
	icon,
	onPress,
	size = "m",
	color = "primary",
	isDisabled = false,
	isBordered = false,
	isLoading = false,
	style,
}: Props) {
	const bgColor =
		isDisabled || isLoading
			? theme.colors.grayLight
			: !isBordered
			? theme.colors[color as keyof typeof theme.colors]
			: undefined

	const btnStyles: StyleProp<ViewStyle> = {
		alignItems: "center",
		justifyContent: "center",
		padding: size === "xs" ? theme.spacing.xxs : theme.spacing.xs,
		backgroundColor: bgColor,
		borderWidth: isBordered ? 1 : 0,
		borderColor: theme.colors[color as keyof typeof theme.colors],
		borderRadius: 80,
	}

	const iconColor = isDisabled
		? theme.colors.grayDark
		: isBordered
		? theme.colors[color as keyof typeof theme.colors]
		: theme.colors.textDark

	const iconSize =
		size === "xs" || size === "s"
			? theme.fontSize.l
			: size === "xl"
			? theme.fontSize.h2
			: theme.fontSize.xxl

	const iconStyles: StyleProp<TextStyle> = {
		color: iconColor,
		fontSize: iconSize,
	}

	return isLoading ? (
		<TouchableOpacity activeOpacity={0.7} style={[btnStyles, style]}>
			<ActivityIndicator size="small" />
		</TouchableOpacity>
	) : (
		<TouchableOpacity
			activeOpacity={0.8}
			style={[btnStyles, style]}
			onPress={onPress}
			disabled={isDisabled}
		>
			{icon === undefined ? null : <MCIcon name={icon} style={iconStyles} />}
		</TouchableOpacity>
	)
}
