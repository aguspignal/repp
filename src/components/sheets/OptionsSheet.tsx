import { initialWindowMetrics } from "react-native-safe-area-context"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import ActionSheet, { SheetProps } from "react-native-actions-sheet"
import StyledText from "../texts/StyledText"

export default function OptionsSheet({
	payload
}: SheetProps<"progressions-list">) {
	return (
		<ActionSheet containerStyle={styles.sheetContainer}>
			<View style={styles.container}>
				{payload?.options.map((opt) => (
					<TouchableOpacity
						onPress={opt?.onPress}
						style={styles.optionContainer}
						key={opt?.label}
					>
						<StyledText
							type="text"
							color={opt.textColor ?? "textLight"}
						>
							{opt.label}
						</StyledText>
					</TouchableOpacity>
				))}
			</View>
		</ActionSheet>
	)
}

const styles = StyleSheet.create({
	sheetContainer: {
		backgroundColor: theme.colors.backgroundDark
	},
	container: {
		backgroundColor: theme.colors.backgroundDark,
		padding: theme.spacing.m,
		marginBottom: initialWindowMetrics?.insets.bottom
	},
	optionContainer: {
		paddingVertical: theme.spacing.xs,
		borderWidth: 0
	},
	optionText: {
		fontSize: theme.fontSize.m,
		textAlign: "center"
	}
})
