import { SheetDefinition, SheetRegister } from "react-native-actions-sheet"
import { theme } from "../resources/theme"
import OptionsSheet from "../components/sheets/OptionsSheet"

export type SheetOption = {
	label: string
	onPress: () => void
	textColor?: keyof typeof theme.colors
}

declare module "react-native-actions-sheet" {
	interface Sheets {
		"progressions-list": SheetDefinition<{
			payload: {
				options: SheetOption[]
			}
		}>
	}
}

export const Sheets = () => (
	<SheetRegister sheets={{ "progressions-list": OptionsSheet }} />
)
