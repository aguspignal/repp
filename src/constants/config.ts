const requireEnv = (key: string, fallback?: string): string => {
	const value = process.env[key] ?? fallback
	if (!value) {
		console.warn(`[config] Missing env var ${key}. Set it in your .env or app config.`)
		return ""
	}
	return value
}

export const config = {
	supabaseUrl: requireEnv("EXPO_PUBLIC_SUPABASE_URL"),
	supabaseAnonKey: requireEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
	sqliteDbName: "repp.db",
} as const
