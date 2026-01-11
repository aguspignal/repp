import { RoutineDayCodeBox } from "../cards/RoutineDayCard"
import { StyleSheet, View } from "react-native"
import { theme } from "../../resources/theme"
import { useUserStore } from "../../stores/useUserStore"
import Button from "../buttons/Button"
import i18next from "../../lib/i18n"
import Modal from "react-native-modal"
import StyledText from "../texts/StyledText"

type Props = {
	isVisible: boolean
	setIsVisible: (b: boolean) => void
	onStart: (dayId: number) => void
	onCancel: () => void
	routineId: number | undefined
}

export default function StartWorkoutModal({
	isVisible,
	setIsVisible,
	onStart,
	onCancel,
	routineId
}: Props) {
	const { routines } = useUserStore()

	const days = routines.find((r) => r.routine.id === routineId)?.days

	function handleConfirm(dayId: number | undefined) {
		if (!dayId) return
		onStart(dayId)
	}

	return (
		<Modal
			isVisible={isVisible}
			onBackdropPress={() => setIsVisible(false)}
			onBackButtonPress={() => setIsVisible(false)}
		>
			<View style={styles.container}>
				<StyledText type="boldText" align="center" style={styles.title}>
					{i18next.t(
						"actions.choose-training-day-to-start-working-out"
					)}
				</StyledText>

				<View style={styles.daysContainer}>
					{days?.map((d) => (
						<RoutineDayCodeBox
							dayId={d.id}
							code={d.code}
							color="textLight"
							size="m"
							onPress={handleConfirm}
							key={d.id}
						/>
					))}
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.backgroundDark,
		marginHorizontal: theme.spacing.s,
		padding: theme.spacing.s,
		borderRadius: theme.spacing.s,
		gap: theme.spacing.m
	},
	title: {
		marginHorizontal: theme.spacing.s
	},
	daysContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: theme.spacing.xxs
	},
	actionsContainer: {
		flexDirection: "row",
		gap: theme.spacing.s
	}
})
