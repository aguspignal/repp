import { Pressable, StyleSheet, View } from "react-native"

import { theme } from "../../theme"
import { Text } from "./Text"

export type SegmentedOption<T extends string> = {
	value: T
	label: string
}

type Props<T extends string> = {
	options: SegmentedOption<T>[]
	value: T | null
	onChange: (value: T | null) => void
	nullable?: boolean
	disabled?: boolean
}

export const SegmentedControl = <T extends string>({
	options,
	value,
	onChange,
	nullable = false,
	disabled,
}: Props<T>) => (
	<View style={styles.row}>
		{options.map((opt, idx) => {
			const active = value === opt.value
			const isFirst = idx === 0
			const isLast = idx === options.length - 1
			return (
				<Pressable
					key={opt.value}
					accessibilityRole="button"
					accessibilityState={{ selected: active, disabled: !!disabled }}
					disabled={disabled}
					onPress={() => {
						if (active && nullable) onChange(null)
						else if (!active) onChange(opt.value)
					}}
					style={({ pressed }) => [
						styles.segment,
						active ? styles.segmentActive : styles.segmentInactive,
						isFirst ? styles.segmentFirst : null,
						isLast ? styles.segmentLast : null,
						pressed && !active ? styles.pressed : null,
						disabled ? styles.disabled : null,
					]}
				>
					<Text
						variant="label"
						color={active ? "textDark" : "textLight"}
						align="center"
						numberOfLines={1}
					>
						{opt.label}
					</Text>
				</Pressable>
			)
		})}
	</View>
)

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		borderRadius: theme.radii.s,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: theme.colors.backgroundGray,
	},
	segment: {
		flex: 1,
		paddingVertical: theme.spacing.xs,
		paddingHorizontal: theme.spacing.xxs,
		alignItems: "center",
		justifyContent: "center",
		borderRightWidth: 1,
		borderRightColor: theme.colors.backgroundGray,
	},
	segmentLast: { borderRightWidth: 0 },
	segmentFirst: {},
	segmentActive: { backgroundColor: theme.colors.primary },
	segmentInactive: { backgroundColor: theme.colors.backgroundDark },
	pressed: { opacity: 0.85 },
	disabled: { opacity: 0.5 },
})
