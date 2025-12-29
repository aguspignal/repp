import { StyleSheet, View } from "react-native"
import StyledText from "../texts/StyledText"
import MCIcon from "../icons/MCIcon"
import { theme } from "../../resources/theme"

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
