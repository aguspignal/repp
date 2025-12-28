import { StyleSheet } from "react-native"
import { theme } from "../../resources/theme"

export const inputStyles = StyleSheet.create({
	inputContainer: {
		marginVertical: theme.spacing.xxs,
	},
	label: {
		marginBottom: 4,
	},
	input: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.s,
		paddingHorizontal: theme.spacing.s,
		paddingVertical: theme.spacing.xs,
		borderRadius: theme.spacing.xxs,
		borderWidth: 1,
		borderColor: theme.colors.grayLight,
	},
	filledInput: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.s,
		paddingHorizontal: theme.spacing.s,
		paddingVertical: theme.spacing.xs,
		backgroundColor: theme.colors.backgroundGray,
		borderRadius: theme.spacing.xxs,
	},
	errorMessage: {
		marginTop: theme.spacing.xxs,
	},
	forgotPswBtn: {
		marginTop: theme.spacing.xxs,
	},
	containerWithIcon: {
		position: "relative",
	},
	leftIcon: {
		position: "absolute",
		left: theme.spacing.s,
		top: theme.spacing.xs + 5,
	},
	leftIconPadding: {
		paddingLeft: theme.spacing.s + 1.2 * theme.fontSize.xs,
	},
	rightIconContainer: {
		position: "absolute",
		right: theme.spacing.s,
		top: theme.spacing.xs,
		zIndex: 1000,
	},
	rightIcon: {
		fontSize: theme.fontSize.xl,
		color: theme.colors.grayDark,
	},
	inputAndBtnContainer: {
		flexDirection: "row",
		borderRadius: 80,
		borderWidth: 1,
		borderColor: theme.colors.grayLight,
		padding: 4,
	},
	inputWithBtn: {
		flex: 1,
		borderWidth: 0,
	},
})
