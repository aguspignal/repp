import { useEffect } from "react"

import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/authStore"

export const useAuthListener = (): void => {
	const setSession = useAuthStore(s => s.setSession)
	const setProfile = useAuthStore(s => s.setProfile)
	const setReady = useAuthStore(s => s.setReady)

	useEffect(() => {
		let mounted = true

		const bootstrap = async () => {
			const { data } = await supabase.auth.getSession()
			if (!mounted) return
			setSession(data.session)

			if (data.session?.user) {
				const { data: profile } = await supabase
					.from("users")
					.select("*")
					.eq("uuid", data.session.user.id)
					.maybeSingle()
				if (mounted) setProfile(profile ?? null)
			}
			if (mounted) setReady(true)
		}

		bootstrap()

		const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
			setSession(session)
			if (!session?.user) {
				setProfile(null)
				return
			}
			const { data: profile } = await supabase
				.from("users")
				.select("*")
				.eq("uuid", session.user.id)
				.maybeSingle()
			setProfile(profile ?? null)
		})

		return () => {
			mounted = false
			sub.subscription.unsubscribe()
		}
	}, [setProfile, setReady, setSession])
}

export const signInWithPassword = async (email: string, password: string) => {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password })
	if (error) throw error
	return data
}

export const signUpWithPassword = async (email: string, password: string) => {
	const { data, error } = await supabase.auth.signUp({ email, password })
	if (error) throw error
	return data
}

export const signOut = async () => {
	const { error } = await supabase.auth.signOut()
	if (error) throw error
}
