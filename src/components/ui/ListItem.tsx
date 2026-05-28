import { Pressable, StyleSheet, View, type ViewStyle } from "react-native"

import { theme } from "../../theme"
import { Icon, type IconName } from "./Icon"
import { Stack } from "./Stack"
import { Text } from "./Text"

export type ListItemVariant = "card" | "plain"

type Props = {
	title: string
	description?: string
	leftIcon?: IconName
	rightIcon?: IconName
	onPress?: () => void
	disabled?: boolean
	variant?: ListItemVariant
	style?: ViewStyle
}

export const ListItem = ({
	title,
	description,
	leftIcon,
	rightIcon = "chevron-forward",
	onPress,
	disabled,
	variant = "card",
	style,
}: Props) => (
	<Pressable
		onPress={onPress}
		disabled={disabled || !onPress}
		style={({ pressed }) => [
			styles.row,
			variantStyles[variant],
			onPress && pressed && !disabled ? styles.pressed : null,
			disabled ? styles.disabled : null,
			style,
		]}
	>
		{leftIcon ? (
			<View style={styles.leftIcon}>
				<Icon name={leftIcon} color="primary" size={22} />
			</View>
		) : null}
		<Stack flex={1} gap="x3s">
			<Text variant="subtitle">{title}</Text>
			{description ? (
				<Text variant="bodySmall" color="grayDark">
					{description}
				</Text>
			) : null}
		</Stack>
		{onPress ? <Icon name={rightIcon} color="grayDark" size={18} /> : null}
	</Pressable>
)

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.s,
		paddingVertical: theme.spacing.s,
	},
	pressed: { opacity: 0.7 },
	disabled: { opacity: 0.5 },
	leftIcon: {
		width: 36,
		height: 36,
		borderRadius: theme.radii.s,
		backgroundColor: theme.colors.backgroundGray,
		alignItems: "center",
		justifyContent: "center",
	},
})

const variantStyles: Record<ListItemVariant, ViewStyle> = {
	card: {
		paddingHorizontal: theme.spacing.s,
		borderRadius: theme.radii.m,
		backgroundColor: theme.colors.backgroundDark,
	},
	plain: {
		paddingHorizontal: 0,
		backgroundColor: "transparent",
	},
}
