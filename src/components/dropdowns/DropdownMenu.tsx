import {
	Menu,
	MenuOption,
	MenuOptions,
	MenuTrigger
} from "react-native-popup-menu"
import { ReactNode } from "react"
import { StyleSheet } from "react-native"
import { theme } from "../../resources/theme"

export type DropdownOption = {
	text: string
	onSelect: () => void
}

type Props = {
	renderTrigger?: ReactNode
	options: (DropdownOption | null)[]
}

export default function DropdownMenu({ renderTrigger, options }: Props) {
	return (
		<Menu>
			<MenuTrigger>{renderTrigger}</MenuTrigger>
			<MenuOptions
				customStyles={{
					optionsContainer: styles.optionsContainer,
					optionsWrapper: styles.optionsWrapper,
					optionText: styles.optionText
				}}
			>
				{options
					.filter((opt) => opt !== null)
					.map((opt) => (
						<MenuOption
							key={opt.text}
							text={opt.text}
							onSelect={opt.onSelect}
							style={styles.optionTouchable}
						/>
					))}
			</MenuOptions>
		</Menu>
	)
}

const styles = StyleSheet.create({
	optionsContainer: {
		marginTop: theme.spacing.xl,
		borderRadius: theme.spacing.xs,
		backgroundColor: theme.colors.backgroundGray
	},
	optionsWrapper: {
		color: theme.colors.textLight,
		paddingVertical: theme.spacing.xxs,
		paddingHorizontal: theme.spacing.xxs
	},
	optionText: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.s
	},
	optionTouchable: {
		paddingVertical: theme.spacing.xs
	}
})
