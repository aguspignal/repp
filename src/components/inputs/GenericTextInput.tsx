import { StyleProp, StyleSheet, TextInput, TextStyle } from "react-native"
import { theme } from "../../resources/theme"

type Props = {
	value: string | undefined
	onChange: (text: string) => void
	placeholder?: string
	stretch?: boolean
	style?: StyleProp<TextStyle>
}
export default function GenericTextInput({
	value,
	onChange,
	placeholder,
	stretch = true,
	style
}: Props) {
	return (
		<TextInput
			value={value}
			onChangeText={(txt) => onChange(txt)}
			placeholder={placeholder}
			style={[styles.input, stretch ? { flex: 1 } : null, style]}
		/>
	)
}

const styles = StyleSheet.create({
	input: {
		padding: theme.spacing.s,
		backgroundColor: theme.colors.backgroundGray,
		borderRadius: theme.spacing.xxs,
		fontSize: theme.fontSize.s,
		color: theme.colors.textLight
	}
})
