import {
	BlurEvent,
	StyleProp,
	StyleSheet,
	TextInput,
	TextStyle,
	View,
	ViewStyle
} from "react-native"
import { theme } from "../../resources/theme"

type Props = {
	value: string | undefined
	onChange: (txt: string) => void
	onBlur?: (e: BlurEvent) => void
	size: "s" | "m"
}
export default function RoutineDayCodeInput({
	onChange,
	onBlur,
	value,
	size
}: Props) {
	const boxStyles: StyleProp<ViewStyle> = {
		borderWidth: 1,
		borderRadius: theme.spacing.xxs,
		borderColor: theme.colors.textLight,
		width: size === "s" ? theme.spacing.x3l : 56,
		height: size === "s" ? theme.spacing.x3l : 56,
		alignItems: "center",
		justifyContent: "center"
	}

	const textStyle: StyleProp<TextStyle> = {
		fontSize: size === "s" ? theme.fontSize.s : theme.fontSize.m
	}

	return (
		<View style={boxStyles}>
			<TextInput
				value={value}
				onChangeText={(txt) => onChange(txt.toUpperCase())}
				onBlur={onBlur}
				placeholder="ABC"
				maxLength={3}
				style={[styles.input, textStyle]}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	input: {
		// padding: theme.spacing.s,
		// backgroundColor: theme.colors.backgroundGray,
		borderRadius: theme.spacing.xxs,
		fontSize: theme.fontSize.s,
		color: theme.colors.textLight
	}
})
