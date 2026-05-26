import { forwardRef } from "react"
import {
	StyleSheet,
	TextInput,
	View,
	type TextInputProps,
	type TextInput as TextInputType,
} from "react-native"

import { theme } from "../../theme"
import { Text } from "./Text"

type Props = TextInputProps & {
	label?: string
	error?: string | null
	hint?: string
}

export const TextField = forwardRef<TextInputType, Props>(
	({ label, error, hint, style, ...props }, ref) => (
		<View style={styles.wrap}>
			{label ? (
				<Text variant="label" color="textLight">
					{label}
				</Text>
			) : null}
			<TextInput
				ref={ref}
				placeholderTextColor={theme.colors.grayDark}
				{...props}
				style={[styles.input, error ? styles.inputError : null, style]}
			/>
			{error ? (
				<Text variant="caption" color="danger">
					{error}
				</Text>
			) : hint ? (
				<Text variant="caption" color="grayDark">
					{hint}
				</Text>
			) : null}
		</View>
	),
)

TextField.displayName = "TextField"

const styles = StyleSheet.create({
	wrap: { gap: theme.spacing.x3s },
	input: {
		borderWidth: 1,
		borderColor: theme.colors.backgroundGray,
		borderRadius: theme.radii.s,
		paddingVertical: theme.spacing.xs,
		paddingHorizontal: theme.spacing.s,
		fontSize: theme.fontSize.s,
		color: theme.colors.textLight,
		backgroundColor: theme.colors.backgroundDark,
	},
	inputError: { borderColor: theme.colors.danger },
})
