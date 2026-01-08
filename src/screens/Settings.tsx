import { StyleSheet, View } from "react-native"
import { theme } from "../resources/theme"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../stores/useUserStore"
import Button from "../components/buttons/Button"
import useSession from "../hooks/useSession"

export default function Settings() {
	const { t } = useTranslation()
	const { endSession } = useSession()
	const { clearUserStore } = useUserStore()

	function handleLogout() {
		endSession()
		clearUserStore()
	}

	return (
		<View style={styles.container}>
			<Button title={t("actions.logout")} onPress={handleLogout} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		alignItems: "center"
	}
})
