import { StyleSheet, View } from "react-native"
import StyledText from "../../components/texts/StyledText"
import { theme } from "../../resources/theme"

export default function RoutineDayHistory() {
	return (
		<View style={styles.container}>
			<StyledText type="subtitle">routine day history</StyledText>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		paddingHorizontal: theme.spacing.s
	}
})
