import { StyleSheet, View } from "react-native"
import StyledText from "../../components/texts/StyledText"

export default function RoutineSchedule() {
	return (
		<View style={styles.container}>
			<StyledText type="text">Schedule</StyledText>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {}
})
