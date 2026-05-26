import Ionicons from "@react-native-vector-icons/ionicons/static"
import type { ComponentProps } from "react"

import { theme, type ThemeColor } from "../../theme"

export type IconName = ComponentProps<typeof Ionicons>["name"]

type Props = {
	name: IconName
	size?: number
	color?: ThemeColor | string
}

const isThemeColor = (c: string): c is ThemeColor => c in theme.colors

export const Icon = ({ name, size = 24, color = "textLight" }: Props) => {
	const resolved = isThemeColor(color) ? theme.colors[color] : color
	return <Ionicons name={name} size={size} color={resolved} />
}
