import { StyleSheet, Switch, View } from "react-native"

import { theme } from "../../theme"
import { Stack } from "./Stack"
import { Text } from "./Text"

type Props = {
	label: string
	description?: string
	value: boolean
	onChange: (value: boolean) => void
	disabled?: boolean
}

export const SwitchRow = ({ label, description, value, onChange, disabled }: Props) => (
	<View style={styles.row}>
		<Stack flex={1} gap="x3s">
			<Text variant="subtitle">{label}</Text>
			{description ? (
				<Text variant="bodySmall" color="grayDark">
					{description}
				</Text>
			) : null}
		</Stack>
		<Switch
			value={value}
			onValueChange={onChange}
			disabled={disabled}
			trackColor={{
				false: theme.colors.backgroundGray,
				true: theme.colors.primary,
			}}
			thumbColor={theme.colors.textLight}
		/>
	</View>
)

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.s,
		paddingVertical: theme.spacing.xxs,
	},
})
