import { StyleProp, TouchableOpacity, ViewStyle } from "react-native"
import { TextType } from "../../types/misc"
import { theme } from "../../resources/theme"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type CodeBoxProps = {
	dayId: number | undefined
	code: string | undefined
	plusIcon?: boolean
	color: keyof typeof theme.colors
	size: "s" | "m"
	onPress?: (dayId: number | undefined) => void
}

export function RoutineDayCodeBox({
	dayId,
	code,
	plusIcon = false,
	color,
	size,
	onPress
}: CodeBoxProps) {
	const boxStyles: StyleProp<ViewStyle> = {
		borderWidth: 1,
		borderRadius: theme.spacing.xxs,
		borderColor: theme.colors[color as keyof typeof theme.colors],
		width: size === "s" ? theme.spacing.x3l : 56,
		height: size === "s" ? theme.spacing.x3l : 56,
		alignItems: "center",
		justifyContent: "center"
	}

	const textType: TextType = size === "s" ? "boldText" : "subtitle"
	const plusIconSize: keyof typeof theme.fontSize = size === "s" ? "h3" : "h2"

	function handlePress() {
		if (onPress && dayId) onPress(dayId)
	}

	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={!onPress || !dayId}
			style={boxStyles}
		>
			{plusIcon ? (
				<MCIcon name="plus" color={color} size={plusIconSize} />
			) : (
				<StyledText type={textType} color={color}>
					{code ?? "ABC"}
				</StyledText>
			)}
		</TouchableOpacity>
	)
}
