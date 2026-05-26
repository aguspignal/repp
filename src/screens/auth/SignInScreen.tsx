import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import type { TextInput as TextInputType } from "react-native"

import {
	Banner,
	Button,
	Row,
	Screen,
	ScreenHeader,
	Stack,
	Text,
	TextField,
} from "../../components/ui"
import { signInWithPassword } from "../../hooks/useAuth"
import type { AuthStackParamList } from "../../navigation/types"

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">

type FieldErrors = { email?: string; password?: string }

export const SignInScreen = ({ navigation }: Props) => {
	const { t } = useTranslation()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [errors, setErrors] = useState<FieldErrors>({})
	const [loading, setLoading] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)
	const passwordRef = useRef<TextInputType>(null)

	const validate = (emailValue: string, passwordValue: string): FieldErrors => {
		const fieldErrors: FieldErrors = {}
		if (!emailValue) fieldErrors.email = t("auth.signIn.errors.emailRequired")
		else if (!/^\S+@\S+\.\S+$/.test(emailValue))
			fieldErrors.email = t("auth.signIn.errors.emailInvalid")
		if (!passwordValue) fieldErrors.password = t("auth.signIn.errors.passwordRequired")
		return fieldErrors
	}

	const onSubmit = async () => {
		const fieldErrors = validate(email.trim(), password)
		setErrors(fieldErrors)
		setFormError(null)
		if (Object.keys(fieldErrors).length > 0) return

		setLoading(true)
		try {
			await signInWithPassword(email.trim(), password)
		} catch (err) {
			setFormError(err instanceof Error ? err.message : t("auth.signIn.errors.generic"))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Screen scroll avoidKeyboard padding="l">
			<Stack gap="l" flex={1}>
				<ScreenHeader title={t("auth.signIn.title")} subtitle={t("auth.signIn.subtitle")} />

				{formError ? <Banner tone="error" message={formError} /> : null}

				<Stack gap="s">
					<TextField
						label={t("auth.signIn.emailLabel")}
						placeholder={t("auth.signIn.emailPlaceholder")}
						value={email}
						onChangeText={setEmail}
						autoCapitalize="none"
						autoComplete="email"
						keyboardType="email-address"
						returnKeyType="next"
						onSubmitEditing={() => passwordRef.current?.focus()}
						error={errors.email}
					/>
					<TextField
						ref={passwordRef}
						label={t("auth.signIn.passwordLabel")}
						placeholder={t("auth.signIn.passwordPlaceholder")}
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						autoComplete="password"
						returnKeyType="go"
						onSubmitEditing={onSubmit}
						error={errors.password}
					/>
				</Stack>

				<Stack gap="xxs">
					<Button
						title={t("auth.signIn.submit")}
						fullWidth
						onPress={onSubmit}
						loading={loading}
					/>
					<Row gap="x3s" align="center" justify="center">
						<Text variant="bodySmall" color="grayDark">
							{t("auth.signIn.newHere")}
						</Text>
						<Button
							title={t("auth.signIn.createAccount")}
							variant="ghost"
							size="sm"
							onPress={() => navigation.navigate("SignUp")}
						/>
					</Row>
				</Stack>
			</Stack>
		</Screen>
	)
}
