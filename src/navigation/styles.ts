import { StyleSheet } from "react-native"
import { theme } from "../resources/theme"

export const navigationStyles = StyleSheet.create({
    headerTitle: {
        fontSize: theme.fontSize.xl,
        color: theme.colors.textLight,
    },
    headerBackground: {
        backgroundColor: theme.colors.backgroundBlack,
    },
    headerIcon: {
        fontSize: theme.fontSize.h3,
        color: theme.colors.textLight,
        marginLeft: theme.spacing.m,
    },
    headerRightContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: theme.spacing.s,
    },
})