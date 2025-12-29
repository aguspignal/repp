import useExercisesQuery, {
	GETUSEREXERCISESLAZY_KEY
} from "../../hooks/useExercisesQuery"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { RefreshControl, ScrollView, StyleSheet } from "react-native"
import { RootStackScreenProps } from "../../navigation/params"
import { theme } from "../../resources/theme"
import { useEffect } from "react"
import { useUserStore } from "../../stores/useUserStore"
import IconButton from "../../components/buttons/IconButton"
import ItemCard from "../../components/cards/ExerciseCard"

export default function ExerciseRepository({
	navigation
}: RootStackScreenProps<"ExerciseRepository">) {
	const { user, exercises, loadExercises } = useUserStore()
	const { getUserExercisesLazy } = useExercisesQuery()

	const { data, isFetching } = getUserExercisesLazy(user?.id)

	function goToCreateExercise() {
		navigation.navigate("CreateExercise")
	}

	function goToExercise(id: number) {
		navigation.navigate("EditExercise", { id })
	}

	function handleRefresh() {
		invalidateQueries(GETUSEREXERCISESLAZY_KEY(user?.id ?? 0))
	}

	useEffect(() => {
		if (data && !isPostgrestError(data)) loadExercises(data)
	}, [data])

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
			refreshControl={
				<RefreshControl
					refreshing={isFetching}
					onRefresh={handleRefresh}
				/>
			}
		>
			{exercises.map((exerc) => (
				<ItemCard
					exercise={exerc}
					onPress={goToExercise}
					key={exerc.id}
				/>
			))}

			<IconButton
				icon="plus"
				onPress={goToCreateExercise}
				size="xl"
				style={styles.createExerciseBtn}
			/>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		position: "relative",
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack
	},
	contentContainer: {
		flex: 1,
		gap: theme.spacing.xxs,
		paddingHorizontal: theme.spacing.s
	},
	createExerciseBtn: {
		position: "absolute",
		bottom: theme.spacing.xl,
		right: theme.spacing.xl
	}
})
