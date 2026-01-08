import { StyleSheet, View } from "react-native"
import { theme } from "../../resources/theme"
import Button from "../buttons/Button"
import i18next from "../../lib/i18n"
import Modal from "react-native-modal"
import StyledText from "../texts/StyledText"

type Props = {
	isVisible: boolean
	setIsVisible: (b: boolean) => void
	title: string
	subtitle?: string
	confirmText?: string
	confirmColor?: keyof typeof theme.colors
	onConfirm: () => void
	cancelText?: string
	onCancel?: () => void
	isLoadingConfirm?: boolean
}

export default function ConfirmationModal({
	isVisible,
	setIsVisible,
	title,
	subtitle,
	confirmText,
	confirmColor = "primary",
	onConfirm,
	cancelText,
	onCancel,
	isLoadingConfirm = false
}: Props) {
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

				{subtitle ? (
					<StyledText type="text" style={styles.subtitle}>
						{subtitle}
					</StyledText>
				) : null}

				<View style={styles.actionsContainer}>
					<Button
						onPress={
							onCancel ? onCancel : () => setIsVisible(false)
						}
						title={
							cancelText
								? cancelText
								: i18next.t("actions.cancel")
						}
						size="s"
						isBordered
						isDisabled={isLoadingConfirm}
						color="textLight"
						style={{ flex: 1 }}
					/>

					<Button
						onPress={onConfirm}
						title={
							confirmText
								? confirmText
								: i18next.t("actions.confirm")
						}
						size="s"
						color={confirmColor}
						isLoading={isLoadingConfirm}
						style={{ flex: 1 }}
					/>
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
	subtitle: {
		textAlign: "center",
		fontSize: theme.fontSize.xs
	},
	actionsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: theme.spacing.s
	}
})
