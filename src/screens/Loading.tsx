import { ActivityIndicator, StyleSheet, View } from "react-native"
import { theme } from "../resources/theme"

export default function Loading() {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={theme.colors.primary} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: theme.colors.backgroundBlack,
	},
})
