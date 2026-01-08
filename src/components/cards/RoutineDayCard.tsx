import {
	StyleProp,
	StyleSheet,
	TouchableOpacity,
	View,
	ViewStyle
} from "react-native"
import { DatabaseRoutineDay } from "../../types/routines"
import { TextType } from "../../types/misc"
import { theme } from "../../resources/theme"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	routineDay: DatabaseRoutineDay | null
	color?: keyof typeof theme.colors
	title?: string
	onPressCard?: (rd: DatabaseRoutineDay | null) => void
	onPressHistory?: (rd: DatabaseRoutineDay) => void
	// onPressEdit?: (rd: DatabaseRoutineDay) => void
}

export default function RoutineDayCard({
	routineDay,
	color = "textLight",
	title,
	onPressCard,
	// onPressEdit,
	onPressHistory
}: Props) {
	function handlePressCard() {
		if (onPressCard) onPressCard(routineDay)
	}

	// function handleEdit() {
	// 	if (onPressEdit && routineDay) onPressEdit(routineDay)
	// }

	function handleHistory() {
		if (onPressHistory && routineDay) onPressHistory(routineDay)
	}

	return (
		<TouchableOpacity
			onPress={handlePressCard}
			activeOpacity={onPressCard ? 0.7 : 1}
		>
			<View style={styles.header}>
				<View style={styles.codeAndTitle}>
					<RoutineDayCodeBox
						code={routineDay?.code}
						color={color}
						plusIcon={!routineDay}
						size="m"
					/>

					<StyledText type="subtitle" color={color}>
						{routineDay ? routineDay.name : title}
					</StyledText>
				</View>

				<View style={styles.actionContainer}>
					{/* {onPressEdit ? (
						<TouchableOpacity onPress={handleEdit}>
							<MCIcon name="rename" size="h3" />
						</TouchableOpacity>
					) : null} */}
					{onPressHistory ? (
						<TouchableOpacity onPress={handleHistory}>
							<MCIcon name="history" size="h3" />
						</TouchableOpacity>
					) : null}
				</View>
			</View>

			<View style={styles.exercisesContainer}></View>
		</TouchableOpacity>
	)
}

type CodeBoxProps = {
	code: string | undefined
	plusIcon?: boolean
	color: keyof typeof theme.colors
	size: "s" | "m"
}

export function RoutineDayCodeBox({
	code,
	plusIcon = false,
	color,
	size
}: CodeBoxProps) {
	const boxStyles: StyleProp<ViewStyle> = {
		borderWidth: 1,
		borderRadius: theme.spacing.xxs,
		borderColor: theme.colors[color as keyof typeof theme.colors],
		width: size === "s" ? theme.spacing.x3l : 56,
		height: size === "s" ? theme.spacing.x3l : 56,
		alignItems: "center",
		justifyContent: "center"
	}

	const textType: TextType = size === "s" ? "boldText" : "subtitle"
	const plusIconSize: keyof typeof theme.fontSize = size === "s" ? "h3" : "h2"

	return (
		<View style={boxStyles}>
			{plusIcon ? (
				<MCIcon name="plus" color={color} size={plusIconSize} />
			) : (
				<StyledText type={textType} color={color}>
					{code ?? "ABC"}
				</StyledText>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	codeAndTitle: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.s
	},
	actionContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xs
	},
	exercisesContainer: {}
})
