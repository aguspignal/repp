import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import type { TextInput as TextInputType } from "react-native"

import {
	Banner,
	Button,
	PasswordField,
	Row,
	Screen,
	ScreenHeader,
	Stack,
	Text,
	TextField,
} from "../../components/ui"
import { signUpWithPassword } from "../../hooks/useAuth"
import type { AuthStackParamList } from "../../navigation/types"

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">

type FieldErrors = {
	email?: string
	password?: string
	confirm?: string
}

const MIN_PASSWORD = 8

export const SignUpScreen = ({ navigation }: Props) => {
	const { t } = useTranslation()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirm, setConfirm] = useState("")
	const [errors, setErrors] = useState<FieldErrors>({})
	const [loading, setLoading] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const passwordRef = useRef<TextInputType>(null)
	const confirmRef = useRef<TextInputType>(null)

	const validate = (
		emailValue: string,
		passwordValue: string,
		confirmValue: string,
	): FieldErrors => {
		const fieldErrors: FieldErrors = {}

		if (!emailValue) fieldErrors.email = t("auth.signUp.errors.emailRequired")
		else if (!/^\S+@\S+\.\S+$/.test(emailValue))
			fieldErrors.email = t("auth.signUp.errors.emailInvalid")

		if (!passwordValue) fieldErrors.password = t("auth.signUp.errors.passwordRequired")
		else if (passwordValue.length < MIN_PASSWORD)
			fieldErrors.password = t("auth.signUp.errors.passwordTooShort", { min: MIN_PASSWORD })

		if (!confirmValue) fieldErrors.confirm = t("auth.signUp.errors.confirmRequired")
		else if (confirmValue !== passwordValue)
			fieldErrors.confirm = t("auth.signUp.errors.confirmMismatch")

		return fieldErrors
	}

	const onSubmit = async () => {
		const fieldErrors = validate(email.trim(), password, confirm)
		setErrors(fieldErrors)
		setFormError(null)
		setSuccessMessage(null)
		if (Object.keys(fieldErrors).length > 0) return

		setLoading(true)
		try {
			const result = await signUpWithPassword(email.trim(), password)
			if (result.session) return
			setSuccessMessage(t("auth.signUp.successMessage"))
			setPassword("")
			setConfirm("")
		} catch (err) {
			setFormError(err instanceof Error ? err.message : t("auth.signUp.errors.generic"))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Screen scroll avoidKeyboard padding="l">
			<Stack gap="l" flex={1}>
				<ScreenHeader title={t("auth.signUp.title")} subtitle={t("auth.signUp.subtitle")} />

				{formError ? <Banner tone="error" message={formError} /> : null}
				{successMessage ? <Banner tone="success" message={successMessage} /> : null}

				<Stack gap="s">
					<TextField
						label={t("auth.signUp.emailLabel")}
						placeholder={t("auth.signUp.emailPlaceholder")}
						value={email}
						onChangeText={setEmail}
						autoCapitalize="none"
						autoComplete="email"
						keyboardType="email-address"
						returnKeyType="next"
						onSubmitEditing={() => passwordRef.current?.focus()}
						error={errors.email}
					/>
					<PasswordField
						ref={passwordRef}
						label={t("auth.signUp.passwordLabel")}
						placeholder={t("auth.signUp.passwordPlaceholder", { min: MIN_PASSWORD })}
						value={password}
						onChangeText={setPassword}
						autoComplete="new-password"
						returnKeyType="next"
						onSubmitEditing={() => confirmRef.current?.focus()}
						error={errors.password}
					/>
					<PasswordField
						ref={confirmRef}
						label={t("auth.signUp.confirmLabel")}
						placeholder={t("auth.signUp.confirmPlaceholder")}
						value={confirm}
						onChangeText={setConfirm}
						autoComplete="new-password"
						returnKeyType="go"
						onSubmitEditing={onSubmit}
						error={errors.confirm}
					/>
				</Stack>

				<Stack gap="xxs">
					<Button
						title={t("auth.signUp.submit")}
						fullWidth
						onPress={onSubmit}
						loading={loading}
					/>
					<Row gap="x3s" align="center" justify="center">
						<Text variant="bodySmall" color="grayDark">
							{t("auth.signUp.alreadyHaveAccount")}
						</Text>
						<Button
							title={t("auth.signUp.signIn")}
							variant="ghost"
							size="sm"
							onPress={() => navigation.navigate("SignIn")}
						/>
					</Row>
				</Stack>
			</Stack>
		</Screen>
	)
}
