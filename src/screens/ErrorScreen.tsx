import { StyleSheet, Text, View } from "react-native"
import { theme } from "../resources/theme"
import { useTranslation } from "react-i18next"

type Props = {
	errorTitle?: string
	errorMessage?: string
}

export default function ErrorScreen({ errorTitle, errorMessage }: Props) {
	const { t } = useTranslation()
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{errorTitle ?? t("error-messages.ups")}</Text>
			<Text style={styles.message}>
				{errorMessage ?? t("error-messages.an-error-ocurred")}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: theme.colors.backgroundLight,
	},
	title: {
		fontSize: theme.fontSize.xxl,
		fontWeight: "600",
	},
	message: {
		fontSize: theme.fontSize.l,
	},
})
