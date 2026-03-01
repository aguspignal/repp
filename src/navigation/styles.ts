import { StyleSheet } from "react-native"
import { theme } from "../resources/theme"

export const navigationStyles = StyleSheet.create({
	headerTitle: {
		fontSize: theme.fontSize.xl,
		color: theme.colors.textLight
	},
	headerBackground: {
		backgroundColor: theme.colors.backgroundBlack
	},
	headerIcon: {
		fontSize: theme.fontSize.h3,
		color: theme.colors.textLight,
		marginLeft: theme.spacing.m
	},
	headerImage: {
		width: theme.fontSize.h1,
		height: theme.fontSize.h1
	},
	headerRightContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: theme.spacing.s
		// gap: theme.spacing.x3s
	},
	headerTextColor: {
		color: theme.colors.textLight
	},
	tabBar: {
		height: theme.spacing.x3l + 4,
		backgroundColor: theme.colors.backgroundDark
	},
	tabIconContainer: {
		width: theme.fontSize.h3 + 4,
		height: theme.fontSize.h3 + 4,
		marginTop: 4
	},
	tabIcon: {
		fontSize: theme.fontSize.h3,
		color: theme.colors.textLight
	},
	tabIconFocused: {
		color: theme.colors.primary
	}
})
