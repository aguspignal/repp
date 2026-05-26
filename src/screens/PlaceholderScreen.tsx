import { StyleSheet, Text, View } from "react-native"

type Props = { title: string }

export const PlaceholderScreen = ({ title }: Props) => (
	<View style={styles.container}>
		<Text style={styles.title}>{title}</Text>
	</View>
)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
	},
})
