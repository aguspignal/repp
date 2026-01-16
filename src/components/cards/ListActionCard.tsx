import { StyleSheet, View } from "react-native"
import { theme } from "../../resources/theme"
import DropdownMenu, { DropdownOption } from "../dropdowns/DropdownMenu"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	title: string
	triggerLabel: string
	options: DropdownOption[]
}

export default function ListActionCard({
	title,
	triggerLabel,
	options
}: Props) {
	return (
		<View style={styles.container}>
			<StyledText type="text">{title}</StyledText>

			<DropdownMenu
				renderTrigger={<DropdownTrigger label={triggerLabel} />}
				options={options}
			/>
		</View>
	)
}

type DropdownTriggerProps = {
	label: string
	withIcon?: boolean
}
function DropdownTrigger({ label, withIcon = true }: DropdownTriggerProps) {
	return (
		<View style={styles.dropdwownTrigger}>
			<StyledText type="text">{label}</StyledText>

			{withIcon ? <MCIcon name="chevron-down" color="grayDark" /> : null}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	dropdwownTrigger: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xxs,
		backgroundColor: theme.colors.backgroundGray,
		paddingVertical: theme.spacing.xxs,
		paddingHorizontal: theme.spacing.s,
		borderRadius: theme.spacing.xxs
	}
})
