import { StyleSheet, View } from "react-native"
import { theme } from "../../resources/theme"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	title: string
}

export default function ListActionCard({ title }: Props) {
	return (
		<View style={styles.container}>
			<StyledText type="text">{title}</StyledText>

			<MCIcon name="chevron-down" color="grayDark" />
		</View>
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
