import { Pressable, StyleSheet, View } from "react-native"

import { Icon, Row, Stack, Text, type IconName } from "../ui"
import { theme } from "../../theme"
import type { Exercise, ExerciseType } from "../../types/db"

type Props = {
	exercise: Exercise
	onPress?: () => void
}

const typeIcon: Record<ExerciseType, IconName> = {
	bodyweight: "body-outline",
	freeweight: "barbell-outline",
	machine: "build-outline",
}

export const ExerciseCard = ({ exercise, onPress }: Props) => (
	<Pressable
		onPress={onPress}
		disabled={!onPress}
		style={({ pressed }) => [styles.card, onPress && pressed ? styles.pressed : null]}
	>
		<View style={styles.typeIcon}>
			<Icon name={typeIcon[exercise.type]} color="primary" size={22} />
		</View>

		<Stack flex={1} gap="x3s">
			<Text variant="subtitle" numberOfLines={1}>
				{exercise.name}
			</Text>
			{exercise.description ? (
				<Text variant="bodySmall" color="grayDark" numberOfLines={2}>
					{exercise.description}
				</Text>
			) : null}
		</Stack>

		<Row gap="x3s" align="center">
			{exercise.is_isometric ? (
				<View style={styles.flag}>
					<Icon name="time-outline" color="grayDark" size={16} />
				</View>
			) : null}
			{exercise.is_weighted ? (
				<View style={styles.flag}>
					<Icon name="scale-outline" color="grayDark" size={16} />
				</View>
			) : null}
			{onPress ? <Icon name="chevron-forward" color="grayDark" size={18} /> : null}
		</Row>
	</Pressable>
)

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.s,
		paddingVertical: theme.spacing.s,
		paddingHorizontal: theme.spacing.s,
		borderRadius: theme.radii.m,
		backgroundColor: theme.colors.backgroundDark,
	},
	pressed: { opacity: 0.7 },
	typeIcon: {
		width: 36,
		height: 36,
		borderRadius: theme.radii.s,
		backgroundColor: theme.colors.backgroundGray,
		alignItems: "center",
		justifyContent: "center",
	},
	flag: {
		width: 26,
		height: 26,
		borderRadius: theme.radii.xs,
		backgroundColor: theme.colors.backgroundGray,
		alignItems: "center",
		justifyContent: "center",
	},
})
