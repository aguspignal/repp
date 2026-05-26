import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useRef, useState } from "react"
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
import { signUpWithPassword } from "../../hooks/useAuth"
import type { AuthStackParamList } from "../../navigation/types"

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">

type FieldErrors = {
	email?: string
	password?: string
	confirm?: string
}

const MIN_PASSWORD = 8

const validate = (email: string, password: string, confirm: string): FieldErrors => {
	const errors: FieldErrors = {}
	if (!email) errors.email = "Email is required"
	else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email"
	if (!password) errors.password = "Password is required"
	else if (password.length < MIN_PASSWORD)
		errors.password = `Use at least ${MIN_PASSWORD} characters`
	if (!confirm) errors.confirm = "Please confirm your password"
	else if (confirm !== password) errors.confirm = "Passwords do not match"
	return errors
}

export const SignUpScreen = ({ navigation }: Props) => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirm, setConfirm] = useState("")
	const [errors, setErrors] = useState<FieldErrors>({})
	const [loading, setLoading] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const passwordRef = useRef<TextInputType>(null)
	const confirmRef = useRef<TextInputType>(null)

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
			setSuccessMessage(
				"Account created! Check your inbox to confirm your email, then sign in.",
			)
			setPassword("")
			setConfirm("")
		} catch (err) {
			setFormError(err instanceof Error ? err.message : "Could not create account")
		} finally {
			setLoading(false)
		}
	}

	return (
		<Screen scroll avoidKeyboard padding="l">
			<Stack gap="l" flex={1}>
				<ScreenHeader
					title="Create your account"
					subtitle="It only takes a minute. Start tracking your training today."
				/>

				{formError ? <Banner tone="error" message={formError} /> : null}
				{successMessage ? <Banner tone="success" message={successMessage} /> : null}

				<Stack gap="s">
					<TextField
						label="Email"
						placeholder="you@example.com"
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
						label="Password"
						placeholder={`At least ${MIN_PASSWORD} characters`}
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						autoComplete="new-password"
						returnKeyType="next"
						onSubmitEditing={() => confirmRef.current?.focus()}
						error={errors.password}
					/>
					<TextField
						ref={confirmRef}
						label="Confirm password"
						placeholder="Repeat your password"
						value={confirm}
						onChangeText={setConfirm}
						secureTextEntry
						autoComplete="new-password"
						returnKeyType="go"
						onSubmitEditing={onSubmit}
						error={errors.confirm}
					/>
				</Stack>

				<Stack gap="xxs">
					<Button title="Create account" fullWidth onPress={onSubmit} loading={loading} />
					<Row gap="x3s" align="center" justify="center">
						<Text variant="bodySmall" color="grayDark">
							Already have an account?
						</Text>
						<Button
							title="Sign in"
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
