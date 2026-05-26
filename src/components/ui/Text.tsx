import {
	StyleSheet,
	Text as RNText,
	type TextProps as RNTextProps,
	type TextStyle,
} from "react-native"

import { theme, type ThemeColor, type ThemeFontSize, type ThemeFontWeight } from "../../theme"

export type TextVariant =
	| "h1"
	| "h2"
	| "h3"
	| "title"
	| "subtitle"
	| "body"
	| "bodySmall"
	| "caption"
	| "label"

type Props = RNTextProps & {
	variant?: TextVariant
	color?: ThemeColor
	size?: ThemeFontSize
	weight?: ThemeFontWeight
	align?: TextStyle["textAlign"]
}

const variantStyles: Record<TextVariant, { size: ThemeFontSize; weight: ThemeFontWeight }> = {
	h1: { size: "h1", weight: "extrabold" },
	h2: { size: "h2", weight: "extrabold" },
	h3: { size: "h3", weight: "bold" },
	title: { size: "xxl", weight: "bold" },
	subtitle: { size: "m", weight: "semibold" },
	body: { size: "s", weight: "regular" },
	bodySmall: { size: "xs", weight: "regular" },
	caption: { size: "xxs", weight: "medium" },
	label: { size: "xs", weight: "semibold" },
}

export const Text = ({
	variant = "body",
	color = "textLight",
	size,
	weight,
	align,
	style,
	...rest
}: Props) => {
	const v = variantStyles[variant]
	const resolved: TextStyle = {
		fontSize: theme.fontSize[size ?? v.size],
		fontWeight: theme.fontWeight[weight ?? v.weight] as TextStyle["fontWeight"],
		color: theme.colors[color],
		textAlign: align,
	}
	return <RNText {...rest} style={[styles.base, resolved, style]} />
}

const styles = StyleSheet.create({
	base: {
		includeFontPadding: false,
	},
})
