import { FlatList, StyleSheet, View } from "react-native"
import { RootStackScreenProps } from "../../navigation/params"
import { theme } from "../../resources/theme"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import RoutineCard from "../../components/cards/RoutineCard"

export default function ArchivedRoutines({}: RootStackScreenProps<"ArchivedRoutines">) {
	const { t } = useTranslation()
	const { routines } = useUserStore()

	return (
		<View style={styles.container}>
			<FlatList
				data={routines.filter((r) => r.routine.status === "archived")}
				renderItem={({ item: routine }) => (
					<RoutineCard routine={routine} key={routine.routine.id} />
				)}
				contentContainerStyle={styles.routinesList}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		paddingHorizontal: theme.spacing.s
	},
	routinesList: {
		gap: theme.spacing.xl
	}
})
