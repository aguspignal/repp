import { Notifier, NotifierComponents } from "react-native-notifier"
import { StyleProp, TextStyle, ViewStyle } from "react-native"
import { theme } from "../../resources/theme"
import { toastFromBottomAnim } from "../../utils/animations"
import i18next from "../../lib/i18n"

type Props = {
	title?: string
	description?: string
	duration?: number
	type?: "success" | "error"
	slideFrom?: "top" | "bottom"
}

export default function ToastNotification({
	title,
	description,
	duration = 3500,
	type = "error",
	slideFrom = "bottom",
}: Props): void {
	const containerStyle: StyleProp<ViewStyle> = {
		backgroundColor: type === "error" ? theme.colors.danger : theme.colors.primary,
	}

	const titleStyle: StyleProp<TextStyle> = {
		color: theme.colors.textDark,
		fontSize: theme.fontSize.xs,
	}

	const descriptionStyle: StyleProp<TextStyle> = {
		color: theme.colors.textDark,
		fontSize: theme.fontSize.xxs,
	}

	return Notifier.showNotification({
		title: title ?? i18next.t("error-messages.an-error-ocurred-try-again"),
		description: description,
		duration: duration,
		Component: NotifierComponents.Notification,
		componentProps: {
			containerStyle: containerStyle,
			titleStyle: titleStyle,
			descriptionStyle: descriptionStyle,
		},
		translucentStatusBar: slideFrom === "top",
		containerStyle: slideFrom === "bottom" ? toastFromBottomAnim : {},
	})
}
