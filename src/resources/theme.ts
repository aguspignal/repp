const pallete = {
	black0: "#121212",
	black1: "#232323",
	black2: "#343434",
	black3: "#434343",
	white0: "#FDFCFC",
	white1: "#FEFEFE",
	gray0: "#B0B0B0",
	gray1: "#DADADA",
	gray2: "#EAEAEA",
	orange: "#F8961E",
	paleblue: "#5a7fa0",
	red: "#F94144"
}

export const theme = {
	colors: {
		textDark: pallete.black0,
		textLight: pallete.white1,

		backgroundBlack: pallete.black1,
		backgroundDark: pallete.black2,
		backgroundGray: pallete.black3,
		backgroundLight: pallete.white0,

		grayDark: pallete.gray0,
		gray: pallete.gray1,
		grayLight: pallete.gray2,

		primary: pallete.orange,
		secondary: pallete.paleblue,
		danger: pallete.red
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
		x5l: 80
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
		h3: 32
	}
}
