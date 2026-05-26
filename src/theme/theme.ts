import { palette } from "./palette"

export const theme = {
	colors: {
		textDark: palette.black0,
		textLight: palette.white1,

		backgroundBlack: palette.black1,
		backgroundDark: palette.black2,
		backgroundGray: palette.black3,
		backgroundLight: palette.white0,

		grayDark: palette.gray0,
		gray: palette.gray1,
		grayLight: palette.gray2,

		primary: palette.orange,
		secondary: palette.paleblue,
		danger: palette.red,
	},

	spacing: {
		x3s: 4,
		xxs: 8,
		xs: 12,
		s: 16,
		m: 20,
		l: 24,
		xl: 32,
		xxl: 40,
		x3l: 48,
		x4l: 64,
		x5l: 80,
	},

	fontSize: {
		xxs: 12,
		xs: 14,
		s: 16,
		m: 18,
		l: 20,
		xl: 22,
		xxl: 24,
		h1: 48,
		h2: 40,
		h3: 32,
	},

	fontWeight: {
		regular: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
		extrabold: "800",
	},

	radii: {
		xs: 6,
		s: 10,
		m: 14,
		l: 20,
		pill: 999,
	},
} as const

export type Theme = typeof theme
export type ThemeColor = keyof Theme["colors"]
export type ThemeSpacing = keyof Theme["spacing"]
export type ThemeFontSize = keyof Theme["fontSize"]
export type ThemeFontWeight = keyof Theme["fontWeight"]
export type ThemeRadius = keyof Theme["radii"]
