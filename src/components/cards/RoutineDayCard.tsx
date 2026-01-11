import {
	FlatList,
	ListRenderItem,
	StyleProp,
	StyleSheet,
	TouchableOpacity,
	View,
	ViewStyle
} from "react-native"
import {
	DatabaseRoutineDay,
	DatabaseRoutineDayExercise
} from "../../types/routines"
import { TextType } from "../../types/misc"
import { theme } from "../../resources/theme"
import { useUserStore } from "../../stores/useUserStore"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"
import { useCallback } from "react"

type Props = {
	routineDay: DatabaseRoutineDay | null
	rdExercises?: DatabaseRoutineDayExercise[]
	color?: keyof typeof theme.colors
	title?: string
	onPressCard?: (rd: DatabaseRoutineDay | null) => void
	onPressHistory?: (rd: DatabaseRoutineDay) => void
}

export default function RoutineDayCard({
	routineDay,
	rdExercises,
	color = "textLight",
	title,
	onPressCard,
	onPressHistory
}: Props) {
	const { exercises } = useUserStore()

	function handlePressCard() {
		if (onPressCard) onPressCard(routineDay)
	}

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
						dayId={routineDay?.id}
						code={routineDay?.code}
						color={color}
						plusIcon={!routineDay}
						size="m"
						onPress={() => {}}
					/>

					<StyledText type="subtitle" color={color}>
						{routineDay ? routineDay.name : title}
					</StyledText>
				</View>

				<View style={styles.actionContainer}>
					{onPressHistory ? (
						<TouchableOpacity onPress={handleHistory}>
							<MCIcon name="history" size="h3" />
						</TouchableOpacity>
					) : null}
				</View>
			</View>

			{rdExercises && rdExercises.length > 0 ? (
				<View style={styles.exercisesContainer}>
					<View style={styles.exercisesList}>
						{rdExercises.map((rde) => (
							<View key={rde.id}>
								<StyledText type="text" color="grayDark">
									{
										exercises.find(
											(e) => e.id === rde.exercise_id
										)?.name
									}
								</StyledText>
							</View>
						))}
					</View>
				</View>
			) : null}
		</TouchableOpacity>
	)
}

type CodeBoxProps = {
	dayId: number | undefined
	code: string | undefined
	plusIcon?: boolean
	color: keyof typeof theme.colors
	size: "s" | "m"
	onPress?: (dayId: number | undefined) => void
}

export function RoutineDayCodeBox({
	dayId,
	code,
	plusIcon = false,
	color,
	size,
	onPress
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

	function handlePress() {
		if (!onPress || !dayId) return
		onPress(dayId)
	}

	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={!onPress || !dayId}
			style={boxStyles}
		>
			{plusIcon ? (
				<MCIcon name="plus" color={color} size={plusIconSize} />
			) : (
				<StyledText type={textType} color={color}>
					{code ?? "ABC"}
				</StyledText>
			)}
		</TouchableOpacity>
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
	exercisesContainer: {
		paddingLeft: 28
	},
	exercisesList: {
		paddingLeft: theme.spacing.xs,
		paddingTop: theme.spacing.xxs,
		paddingBottom: theme.spacing.x3s,
		borderLeftWidth: 1,
		borderLeftColor: theme.colors.grayDark,
		gap: theme.spacing.xxs
	}
})
