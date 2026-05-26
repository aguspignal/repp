import { View, type ViewProps, type ViewStyle } from "react-native"

import { theme, type ThemeSpacing } from "../../theme"

type Direction = "vertical" | "horizontal"

type Props = ViewProps & {
	direction?: Direction
	gap?: ThemeSpacing
	align?: ViewStyle["alignItems"]
	justify?: ViewStyle["justifyContent"]
	flex?: number
	wrap?: boolean
}

export const Stack = ({
	direction = "vertical",
	gap,
	align,
	justify,
	flex,
	wrap,
	style,
	children,
	...rest
}: Props) => {
	const resolved: ViewStyle = {
		flexDirection: direction === "vertical" ? "column" : "row",
		gap: gap ? theme.spacing[gap] : undefined,
		alignItems: align,
		justifyContent: justify,
		flex,
		flexWrap: wrap ? "wrap" : undefined,
	}
	return (
		<View {...rest} style={[resolved, style]}>
			{children}
		</View>
	)
}

export const Row = (props: Omit<Props, "direction">) => <Stack {...props} direction="horizontal" />
