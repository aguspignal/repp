import { forwardRef, type ReactNode } from "react"
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
	rightAdornment?: ReactNode
}

export const TextField = forwardRef<TextInputType, Props>(
	({ label, error, hint, rightAdornment, style, ...props }, ref) => (
		<View style={styles.wrap}>
			{label ? (
				<Text variant="label" color="textLight">
					{label}
				</Text>
			) : null}
			<View style={styles.inputRow}>
				<TextInput
					ref={ref}
					placeholderTextColor={theme.colors.grayDark}
					{...props}
					style={[
						styles.input,
						rightAdornment ? styles.inputWithRight : null,
						error ? styles.inputError : null,
						style,
					]}
				/>
				{rightAdornment ? (
					<View style={styles.rightAdornment}>{rightAdornment}</View>
				) : null}
			</View>
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

const ADORNMENT_WIDTH = 44

const styles = StyleSheet.create({
	wrap: { gap: theme.spacing.x3s },
	inputRow: { position: "relative", justifyContent: "center" },
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
	inputWithRight: { paddingRight: ADORNMENT_WIDTH },
	inputError: { borderColor: theme.colors.danger },
	rightAdornment: {
		position: "absolute",
		right: 0,
		top: 0,
		bottom: 0,
		width: ADORNMENT_WIDTH,
		alignItems: "center",
		justifyContent: "center",
	},
})
