import {
	FlatList,
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
					{onPressHistory ? (
						<TouchableOpacity onPress={handleHistory}>
							<MCIcon name="history" size="h3" />
						</TouchableOpacity>
					) : null}
				</View>
			</View>

			{rdExercises && rdExercises.length > 0 ? (
				<View style={styles.exercisesContainer}>
					<FlatList
						data={rdExercises}
						renderItem={({ item }) => (
							<View key={item.id}>
								<StyledText type="text" color="grayDark">
									{
										exercises.find(
											(e) => e.id === item.exercise_id
										)?.name
									}
								</StyledText>
							</View>
						)}
						contentContainerStyle={styles.exercisesList}
					/>
				</View>
			) : null}
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
