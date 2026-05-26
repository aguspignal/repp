import type { ReactNode } from "react"
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native"
import { SafeAreaView, type Edge } from "react-native-safe-area-context"

import { theme, type ThemeColor, type ThemeSpacing } from "../../theme"

type Props = {
	children: ReactNode
	background?: ThemeColor
	padding?: ThemeSpacing
	scroll?: boolean
	avoidKeyboard?: boolean
	edges?: Edge[]
	style?: StyleProp<ViewStyle>
	contentStyle?: StyleProp<ViewStyle>
}

export const Screen = ({
	children,
	background = "backgroundBlack",
	padding = "l",
	scroll = false,
	avoidKeyboard = false,
	edges = ["top", "bottom"],
	style,
	contentStyle,
}: Props) => {
	const containerStyle: ViewStyle = {
		backgroundColor: theme.colors[background],
	}
	const innerPadding: ViewStyle = {
		padding: theme.spacing[padding],
	}

	const Body = scroll ? (
		<ScrollView
			contentContainerStyle={[styles.scroll, innerPadding, contentStyle]}
			keyboardShouldPersistTaps="handled"
			showsVerticalScrollIndicator={false}
		>
			{children}
		</ScrollView>
	) : (
		<View style={[styles.flex, innerPadding, contentStyle]}>{children}</View>
	)

	const Wrapped = avoidKeyboard ? (
		<KeyboardAvoidingView
			style={styles.flex}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			{Body}
		</KeyboardAvoidingView>
	) : (
		Body
	)

	return (
		<SafeAreaView edges={edges} style={[styles.flex, containerStyle, style]}>
			{Wrapped}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	flex: { flex: 1 },
	scroll: { flexGrow: 1 },
})
