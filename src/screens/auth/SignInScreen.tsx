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
import { signInWithPassword } from "../../hooks/useAuth"
import type { AuthStackParamList } from "../../navigation/types"

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">

type FieldErrors = { email?: string; password?: string }

const validate = (email: string, password: string): FieldErrors => {
	const errors: FieldErrors = {}
	if (!email) errors.email = "Email is required"
	else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email"
	if (!password) errors.password = "Password is required"
	return errors
}

export const SignInScreen = ({ navigation }: Props) => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [errors, setErrors] = useState<FieldErrors>({})
	const [loading, setLoading] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)
	const passwordRef = useRef<TextInputType>(null)

	const onSubmit = async () => {
		const fieldErrors = validate(email.trim(), password)
		setErrors(fieldErrors)
		setFormError(null)
		if (Object.keys(fieldErrors).length > 0) return

		setLoading(true)
		try {
			await signInWithPassword(email.trim(), password)
		} catch (err) {
			setFormError(err instanceof Error ? err.message : "Could not sign in")
		} finally {
			setLoading(false)
		}
	}

	return (
		<Screen scroll avoidKeyboard padding="l">
			<Stack gap="l" flex={1}>
				<ScreenHeader
					title="Welcome back"
					subtitle="Sign in to keep tracking your progress."
				/>

				{formError ? <Banner tone="error" message={formError} /> : null}

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
						placeholder="••••••••"
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
					<Button title="Sign in" fullWidth onPress={onSubmit} loading={loading} />
					<Row gap="x3s" align="center" justify="center">
						<Text variant="bodySmall" color="grayDark">
							New here?
						</Text>
						<Button
							title="Create an account"
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
