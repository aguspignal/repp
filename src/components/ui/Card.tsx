import { View, type ViewProps, type ViewStyle } from "react-native"

import { theme, type ThemeColor, type ThemeRadius, type ThemeSpacing } from "../../theme"

type Props = ViewProps & {
	background?: ThemeColor
	padding?: ThemeSpacing
	radius?: ThemeRadius
}

export const Card = ({
	background = "backgroundDark",
	padding = "s",
	radius = "m",
	style,
	children,
	...rest
}: Props) => {
	const resolved: ViewStyle = {
		backgroundColor: theme.colors[background],
		padding: theme.spacing[padding],
		borderRadius: theme.radii[radius],
	}
	return (
		<View {...rest} style={[resolved, style]}>
			{children}
		</View>
	)
}
