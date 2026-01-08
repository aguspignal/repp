import {
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	View
} from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ParamListBase } from "@react-navigation/native"
import { ReactNode } from "react"
import { theme } from "../../resources/theme"
import { useHeaderHeight } from "@react-navigation/elements"
import { useTranslation } from "react-i18next"
import Button from "../../components/buttons/Button"
import StyledText from "../../components/texts/StyledText"
import TextButton from "../../components/buttons/TextButton"

type Props = {
	type: "signin" | "signup" | "recovery" | "updatepsw" | "otpcode"
	onSubmit?: () => void
	isLoading?: boolean
	navigation?: NativeStackNavigationProp<ParamListBase, string, undefined>
	children: ReactNode
}

export default function LoginLayout({
	type,
	onSubmit = () => {},
	isLoading,
	children,
	navigation
}: Props) {
	const { t } = useTranslation()
	const headerHeight = useHeaderHeight()

	function handleNavigation() {
		if (navigation)
			navigation.popTo(type === "signin" ? "SignUp" : "SignIn")
	}

	return (
		<KeyboardAvoidingView
			behavior={undefined}
			keyboardVerticalOffset={headerHeight}
			style={styles.container}
		>
			<ScrollView
				contentContainerStyle={[
					styles.subcontainer,
					type === "signin" || type === "signup"
						? { justifyContent: "space-between" }
						: null
				]}
				showsVerticalScrollIndicator={false}
			>
				{type === "otpcode" ? null : (
					<StyledText type="title" style={styles.title}>
						{type === "signin"
							? t("actions.signin")
							: type === "signup"
							? t("actions.create-an-account")
							: type === "recovery"
							? t("actions.recover-password")
							: t("actions.update-your-password")}
					</StyledText>
				)}

				{children}

				<Button
					title={
						type === "signin"
							? t("actions.signin")
							: type === "signup"
							? t("actions.create-account")
							: type === "recovery"
							? t("actions.recover-password")
							: type === "updatepsw"
							? t("actions.update-password")
							: t("actions.verify")
					}
					onPress={onSubmit}
					isLoading={isLoading}
					size="l"
					style={styles.submitBtn}
				/>

				{type === "signin" || type === "signup" ? (
					<View style={styles.goSignupBtnContainer}>
						<StyledText type="text">
							{type === "signin"
								? t("questions.dont-have-account")
								: t("questions.already-have-one")}
						</StyledText>

						<TextButton
							onPress={handleNavigation}
							title={
								type === "signin"
									? t("actions.go-signup")
									: t("actions.go-signin")
							}
							color="primary"
							textType="subtitle"
						/>
					</View>
				) : null}
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		paddingHorizontal: theme.spacing.l
	},
	subcontainer: {
		flex: 1
	},
	title: {
		marginVertical: theme.spacing.m
	},
	submitBtn: {
		marginVertical: theme.spacing.l
	},
	goSignupBtnContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-end",
		paddingBottom: theme.spacing.x4l
	}
})
