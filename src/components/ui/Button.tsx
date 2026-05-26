import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	type PressableProps,
	type StyleProp,
	type TextStyle,
	type ViewStyle,
} from "react-native"

import { theme } from "../../theme"
import { Text } from "./Text"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
export type ButtonSize = "sm" | "md" | "lg"

type Props = Omit<PressableProps, "style" | "children"> & {
	title: string
	variant?: ButtonVariant
	size?: ButtonSize
	loading?: boolean
	fullWidth?: boolean
	style?: StyleProp<ViewStyle>
}

const sizeMap: Record<
	ButtonSize,
	{ vertical: number; horizontal: number; fontSize: number; minHeight: number }
> = {
	sm: {
		vertical: theme.spacing.xxs,
		horizontal: theme.spacing.s,
		fontSize: theme.fontSize.xs,
		minHeight: 36,
	},
	md: {
		vertical: theme.spacing.xs,
		horizontal: theme.spacing.l,
		fontSize: theme.fontSize.s,
		minHeight: 48,
	},
	lg: {
		vertical: theme.spacing.s,
		horizontal: theme.spacing.l,
		fontSize: theme.fontSize.m,
		minHeight: 56,
	},
}

type VariantTokens = {
	bg: ViewStyle["backgroundColor"]
	border?: ViewStyle["borderColor"]
	textColor: TextStyle["color"]
}

const variantTokens: Record<ButtonVariant, VariantTokens> = {
	primary: { bg: theme.colors.primary, textColor: theme.colors.textDark },
	secondary: { bg: theme.colors.secondary, textColor: theme.colors.textLight },
	ghost: {
		bg: "transparent",
		border: theme.colors.backgroundGray,
		textColor: theme.colors.textLight,
	},
	danger: { bg: theme.colors.danger, textColor: theme.colors.textLight },
}

export const Button = ({
	title,
	variant = "primary",
	size = "md",
	loading,
	disabled,
	fullWidth,
	style,
	...rest
}: Props) => {
	const tokens = variantTokens[variant]
	const sz = sizeMap[size]
	const isDisabled = disabled || loading

	const baseStyle: ViewStyle = {
		backgroundColor: tokens.bg,
		paddingVertical: sz.vertical,
		paddingHorizontal: sz.horizontal,
		minHeight: sz.minHeight,
		borderRadius: theme.radii.s,
		borderWidth: tokens.border ? 1 : 0,
		borderColor: tokens.border,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		alignSelf: fullWidth ? "stretch" : undefined,
	}

	return (
		<Pressable
			accessibilityRole="button"
			disabled={isDisabled}
			style={({ pressed }) => [
				baseStyle,
				pressed && !isDisabled ? styles.pressed : null,
				isDisabled ? styles.disabled : null,
				style,
			]}
			{...rest}
		>
			{loading ? (
				<ActivityIndicator color={tokens.textColor as string} />
			) : (
				<Text weight="semibold" style={{ color: tokens.textColor, fontSize: sz.fontSize }}>
					{title}
				</Text>
			)}
		</Pressable>
	)
}

const styles = StyleSheet.create({
	pressed: { opacity: 0.85 },
	disabled: { opacity: 0.5 },
})
