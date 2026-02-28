import { StyleSheet, View } from "react-native"
import { theme } from "../../resources/theme"
import { useState } from "react"
import Button from "../buttons/Button"
import GenericTextInput from "../inputs/GenericTextInput"
import i18next from "../../lib/i18n"
import Modal from "react-native-modal"
import RoutineDayCodeInput from "../inputs/RoutineDayCodeInput"
import StyledText from "../texts/StyledText"

type Props = {
	isVisible: boolean
	setIsVisible: (b: boolean) => void
	onCreate: ({ code, name }: { code: string; name: string }) => void
	onCancel: () => void
	isLoadingCreate?: boolean
}

export default function CreateRoutineDayModal({
	isVisible,
	setIsVisible,
	onCreate,
	onCancel,
	isLoadingCreate = false
}: Props) {
	const [code, setCode] = useState<string | undefined>(undefined)
	const [name, setName] = useState<string | undefined>(undefined)

	function handleConfirm() {
		if (!code || code.length === 0 || !name || name.length === 0) return
		onCreate({ code, name })
		setCode(undefined)
		setName(undefined)
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
						"actions.choose-name-code-for-this-training-day"
					)}
				</StyledText>

				<View style={styles.actionsContainer}>
					<RoutineDayCodeInput
						value={code}
						onChange={setCode}
						size="m"
					/>

					<GenericTextInput
						value={name}
						onChange={setName}
						placeholder={i18next.t("attributes.name")}
					/>
				</View>

				<View style={styles.actionsContainer}>
					{isLoadingCreate ? null : (
						<Button
							onPress={onCancel}
							title={i18next.t("actions.cancel")}
							size="s"
							color="textLight"
							isBordered
							style={{ flex: 1 }}
						/>
					)}
					<Button
						onPress={handleConfirm}
						title={i18next.t("actions.add-day")}
						size="s"
						color="primary"
						isLoading={isLoadingCreate}
						style={{ flex: 2 }}
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
	actionsContainer: {
		flexDirection: "row",
		gap: theme.spacing.s
	}
})
