import { StyleSheet, View } from "react-native"
import { theme } from "../../resources/theme"
import StyledText from "../../components/texts/StyledText"

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
