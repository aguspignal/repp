import { StyleSheet, View, type ViewStyle } from "react-native"

import { theme, type ThemeColor } from "../../theme"
import { Text } from "./Text"

export type BannerTone = "error" | "success" | "info"

type Props = {
	tone: BannerTone
	message: string
}

const toneMap: Record<
	BannerTone,
	{ background: ThemeColor; text: ThemeColor; border: ThemeColor }
> = {
	error: { background: "backgroundDark", text: "danger", border: "danger" },
	success: { background: "backgroundDark", text: "primary", border: "primary" },
	info: { background: "backgroundDark", text: "textLight", border: "backgroundGray" },
}

export const Banner = ({ tone, message }: Props) => {
	const t = toneMap[tone]
	const style: ViewStyle = {
		backgroundColor: theme.colors[t.background],
		borderColor: theme.colors[t.border],
		borderWidth: 1,
	}
	return (
		<View style={[styles.base, style]}>
			<Text variant="bodySmall" color={t.text}>
				{message}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	base: {
		padding: theme.spacing.s,
		borderRadius: theme.radii.s,
	},
})
