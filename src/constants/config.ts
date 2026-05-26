const stripQuotes = (s: string): string => s.replace(/^["']|["']$/g, "")

const sanitizeUrl = (raw: string): string => {
	let v = stripQuotes(raw.trim())
	while (v.endsWith("/")) v = v.slice(0, -1)
	return v
}

const requireEnv = (key: string, fallback?: string): string => {
	const value = process.env[key] ?? fallback
	if (!value) {
		console.warn(`[config] Missing env var ${key}. Set it in your .env or app config.`)
		return ""
	}
	return stripQuotes(value.trim())
}

const supabaseUrl = sanitizeUrl(requireEnv("EXPO_PUBLIC_SUPABASE_URL"))
const supabaseAnonKey = requireEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY")

if (supabaseUrl) {
	if (!/^https?:\/\//.test(supabaseUrl)) {
		console.warn(
			`[config] EXPO_PUBLIC_SUPABASE_URL must start with http:// or https://. Got: "${supabaseUrl}"`,
		)
	} else {
		try {
			const u = new URL(supabaseUrl)
			if (u.pathname !== "/" && u.pathname !== "") {
				console.warn(
					`[config] EXPO_PUBLIC_SUPABASE_URL should be the project root (e.g. https://xxx.supabase.co) — no path. Got path "${u.pathname}". The auth API will append /auth/v1 itself.`,
				)
			}
			console.log(`[config] Supabase target: ${u.origin}`)
		} catch {
			console.warn(`[config] EXPO_PUBLIC_SUPABASE_URL is not a valid URL: "${supabaseUrl}"`)
		}
	}
}

if (supabaseAnonKey && !supabaseAnonKey.startsWith("ey")) {
	console.warn(
		`[config] EXPO_PUBLIC_SUPABASE_ANON_KEY does not look like a JWT (should start with "ey..."). Double-check the value.`,
	)
}

export const config = {
	supabaseUrl,
	supabaseAnonKey,
	sqliteDbName: "repp.db",
} as const
