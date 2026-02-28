import { RoutineDayCodeBox } from "../cards/RoutineDayCodeBox"
import { StyleSheet, View } from "react-native"
import { theme } from "../../resources/theme"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import Button from "../buttons/Button"
import Modal from "react-native-modal"
import StyledText from "../texts/StyledText"

type Props = {
	isVisible: boolean
	setIsVisible: (b: boolean) => void
	title: string
	onSelect: (dayId: number | undefined) => void
	routineId: number | undefined
	showRemoveBtn?: boolean
}

export default function SelectRoutineDayModal({
	isVisible,
	setIsVisible,
	title,
	onSelect,
	routineId,
	showRemoveBtn = false
}: Props) {
	const { t } = useTranslation()
	const { routines } = useUserStore()

	const days = routines.find((r) => r.routine.id === routineId)?.days

	function handleConfirm(dayId: number | undefined) {
		// if (!dayId) return
		onSelect(dayId)
	}

	return (
		<Modal
			isVisible={isVisible}
			onBackdropPress={() => setIsVisible(false)}
			onBackButtonPress={() => setIsVisible(false)}
		>
			<View style={styles.container}>
				<StyledText type="boldText" align="center" style={styles.title}>
					{title}
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

				{showRemoveBtn && (
					<Button
						title={t("actions.remove-day")}
						onPress={() => handleConfirm(undefined)}
					/>
				)}
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
