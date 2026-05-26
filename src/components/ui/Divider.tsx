import { View } from "react-native"

import { theme, type ThemeColor } from "../../theme"

type Props = {
	color?: ThemeColor
	thickness?: number
}

export const Divider = ({ color = "backgroundGray", thickness = 1 }: Props) => (
	<View
		style={{ height: thickness, backgroundColor: theme.colors[color], alignSelf: "stretch" }}
	/>
)
