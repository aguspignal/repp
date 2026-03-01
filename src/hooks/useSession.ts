import { SignInValues, SignUpValues } from "../utils/zodSchemas"
import { supabase } from "../lib/supabase"
// import * as QueryParams from "expo-auth-session/build/QueryParams"

export default function useSession() {
	async function getSession() {
		const { data, error } = await supabase.auth.getSession()

		if (error) throw error
		return data.session
	}

	async function getSessionUser() {
		const { data, error } = await supabase.auth.getUser()

		if (error) throw error
		return data.user
	}

	async function endSession() {
		const { error } = await supabase.auth.signOut()

		if (error) throw error
	}

	async function signUpWithEmail({ email, password }: SignUpValues) {
		const { error } = await supabase.auth.signUp({
			email: email.toLowerCase(),
			password: password
		})

		if (error) {
			console.log(error)
			return error
		}
		return null
	}

	async function signInWithEmail({ email, password }: SignInValues) {
		const { error } = await supabase.auth.signInWithPassword({
			email: email.toLowerCase(),
			password: password
		})

		if (error) {
			// if (error.code === "email_not_confirmed")
			// 	supabase.auth.resend({ type: "signup", email })
			console.log(error)
			return error
		}
		return null
	}

	return {
		getSession,
		getSessionUser,
		endSession,
		signUpWithEmail,
		signInWithEmail
	}
}
