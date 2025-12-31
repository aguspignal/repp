import { StyleSheet, TouchableOpacity } from "react-native"
import { theme } from "../../resources/theme"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	title: string
}

export default function ListActionCard({ title }: Props) {
	function handlePressCard() {}

	return (
		<TouchableOpacity style={styles.container} onPress={handlePressCard}>
			<StyledText type="text">{title}</StyledText>

			<MCIcon name="chevron-down" color="grayDark" />
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xxs,
		backgroundColor: theme.colors.backgroundGray,
		paddingVertical: theme.spacing.xxs,
		paddingHorizontal: theme.spacing.s,
		borderRadius: theme.spacing.xxs
	}
})
