import { LoginScreenProps } from "../../navigation/params"
import { StyleSheet, View, TouchableOpacity, Image } from "react-native"
import { theme } from "../../resources/theme"
import { useTranslation } from "react-i18next"
import Button from "../../components/buttons/Button"
import StyledText from "../../components/texts/StyledText"

export default function Welcome({ navigation }: LoginScreenProps<"Welcome">) {
	const { t } = useTranslation()

	return (
		<View style={styles.container}>
			<Image
				style={styles.image}
				source={require("../../../assets/icon.png")}
			/>

			<View style={styles.subcontainer}>
				<View style={styles.btnsContainer}>
					<Button
						onPress={() => navigation.navigate("SignUp")}
						title={t("actions.create-account")}
						size="l"
					/>

					<Button
						onPress={() => navigation.navigate("SignIn")}
						title={t("actions.login")}
						size="l"
						isBordered
					/>
				</View>

				<TouchableOpacity onPress={() => {}} style={styles.politicsContainer}>
					<StyledText type='note' color="gray" align="center">
                        {t("messages.accepting-terms-policies")}{" "}
                        <StyledText type='boldNote' color="secondary">{t("messages.terms-and-policies")}</StyledText>
                    </StyledText>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		alignItems: "center",
		justifyContent: "space-between",
	},
	subcontainer: {
		alignItems: "center",
		gap: theme.spacing.xxl,
	},
	image: {
		width: 240,
		height: 240,
	},
	politicsContainer: {
		margin: theme.spacing.xl,
	},
	politics: {
		fontSize: theme.fontSize.xxs,
		textAlign: "center",
		color: theme.colors.grayDark,
	},
	greenText: {
		color: theme.colors.secondary,
		fontWeight: "600",
	},
	btnsContainer: {
		gap: theme.spacing.s,
		alignSelf: "stretch",
		paddingHorizontal: theme.spacing.xl,
	},
})
