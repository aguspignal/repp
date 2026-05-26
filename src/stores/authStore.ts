import type { Session } from "@supabase/supabase-js"
import { create } from "zustand"

import type { User } from "../types/db"

type AuthState = {
	session: Session | null
	profile: User | null
	isReady: boolean
	setSession: (session: Session | null) => void
	setProfile: (profile: User | null) => void
	setReady: (ready: boolean) => void
	reset: () => void
}

export const useAuthStore = create<AuthState>(set => ({
	session: null,
	profile: null,
	isReady: false,
	setSession: session => set({ session }),
	setProfile: profile => set({ profile }),
	setReady: isReady => set({ isReady }),
	reset: () => set({ session: null, profile: null }),
}))

export const selectUserId = (s: AuthState): number | null => s.profile?.id ?? null
