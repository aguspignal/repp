import { useEffect } from "react"

import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/authStore"

export const useAuthListener = (): void => {
	const setSession = useAuthStore(s => s.setSession)
	const setProfile = useAuthStore(s => s.setProfile)
	const setReady = useAuthStore(s => s.setReady)

	useEffect(() => {
		let mounted = true

		const loadProfile = async (uuid: string) => {
			const { data } = await supabase.from("users").select("*").eq("uuid", uuid).maybeSingle()
			if (mounted) setProfile(data ?? null)
		}

		const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
			if (!mounted) return
			setSession(session)
			setReady(true)
			if (session?.user) {
				loadProfile(session.user.id)
			} else {
				setProfile(null)
			}
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
