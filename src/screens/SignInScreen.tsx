import { useState } from "react"
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native"

import { signInWithPassword } from "../hooks/useAuth"

export const SignInScreen = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)

	const onSubmit = async () => {
		setLoading(true)
		try {
			await signInWithPassword(email, password)
		} catch (err) {
			Alert.alert("Sign in failed", err instanceof Error ? err.message : "Unknown error")
		} finally {
			setLoading(false)
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Sign in</Text>
			<TextInput
				placeholder="Email"
				autoCapitalize="none"
				keyboardType="email-address"
				value={email}
				onChangeText={setEmail}
				style={styles.input}
			/>
			<TextInput
				placeholder="Password"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
				style={styles.input}
			/>
			<Button title={loading ? "Signing in..." : "Sign in"} onPress={onSubmit} disabled={loading} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 24, justifyContent: "center", gap: 12, backgroundColor: "#fff" },
	title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
	input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12 },
})
