import {
	parseExerciseFilterByToText,
	parseExerciseSortByToText
} from "../../utils/parsing"
import {
	DatabaseExercise,
	ExerciseWithProgressions,
	ExerciseFilterBy,
	ExerciseSortBy
} from "../../types/exercises"
import { isPostgrestError } from "../../utils/queriesHelpers"
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native"
import { RootStackScreenProps } from "../../navigation/params"
import { sortExercisesAndProgressionsBy } from "../../utils/sorting"
import { theme } from "../../resources/theme"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import Button from "../../components/buttons/Button"
import ExerciseCard from "../../components/cards/ExerciseCard"
import IconButton from "../../components/buttons/IconButton"
import ListActionCard from "../../components/cards/ListActionCard"
import useExercisesQuery from "../../hooks/useExercisesQuery"

export default function ExerciseRepository({
	navigation,
	route
}: RootStackScreenProps<"ExerciseRepository">) {
	const { t } = useTranslation()
	const { user, exercises, loadExercisesAndProgressions } = useUserStore()
	const { getUserExercisesAndProgressionsLazy } = useExercisesQuery()

	const {
		refetch: fetchExerciseAndProgressions,
		data,
		isFetching
	} = getUserExercisesAndProgressionsLazy(user?.id)

	const [exercisesList, setExercisesList] =
		useState<ExerciseWithProgressions[]>(exercises)
	const [sortBy, setSortBy] = useState<ExerciseSortBy>("ascending")
	const [filterBy, setFilterBy] = useState<ExerciseFilterBy>("all")
	const [selectedExercises, setSelectedExercises] = useState<
		DatabaseExercise[]
	>([])

	const isSelectionView = !!route?.params?.editingRoutineDayId

	function goToCreateExercise() {
		navigation.navigate("CreateExercise")
	}

	function goToExercise(exercise: DatabaseExercise) {
		navigation.navigate("EditExercise", { id: exercise.id })
	}

	function handleRefresh() {
		fetchExerciseAndProgressions()
		// invalidateQueries(GETUSEREXERCISESLAZY_KEY(user?.id ?? 0))
	}

	function handleSort(by: ExerciseSortBy) {
		setSortBy(by)
		setExercisesList((prev) => sortExercisesAndProgressionsBy(prev, by))
	}

	function handleFilter(param: ExerciseFilterBy) {
		setFilterBy(param)

		setExercisesList(
			exercises.filter((e) => {
				if (param === "all") return true
				else if (param === "bodyweight") return e.exercise.is_bodyweight
				else if (param === "freeweight") return e.exercise.is_freeweight
				else return e.exercise.is_isometric
			})
		)
	}

	function handleSelectExercise(
		selectedExercise: DatabaseExercise,
		selected: boolean
	) {
		if (selected)
			setSelectedExercises((prev) => prev.concat(selectedExercise))
		else
			setSelectedExercises((prev) =>
				prev.filter((e) => e.id !== selectedExercise.id)
			)
	}

	function handleAddSelectedExercises() {
		if (!route.params.editingRoutineDayId) return

		navigation.popTo("EditRoutineDay", {
			id: route.params.editingRoutineDayId,
			selectedExercises
		})
	}

	useEffect(() => {
		if (data && !isPostgrestError(data)) {
			console.log(data.find((d) => d.exercise.id === 20)?.progressions)
			loadExercisesAndProgressions(
				sortExercisesAndProgressionsBy(data, sortBy)
			)
		}
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
			<View style={styles.actionsContainer}>
				<ListActionCard
					title={t("actions.sort")}
					triggerLabel={parseExerciseSortByToText(sortBy)}
					options={[
						{
							text: "A-Z",
							onSelect: () => handleSort("ascending")
						},
						{
							text: "Z-A",
							onSelect: () => handleSort("descending")
						},
						{
							text: t("attributes.type"),
							onSelect: () => handleSort("type")
						}
					]}
				/>

				<ListActionCard
					title={t("actions.filter")}
					triggerLabel={parseExerciseFilterByToText(filterBy)}
					options={[
						{
							text: t("attributes.all"),
							onSelect: () => handleFilter("all")
						},
						{
							text: t("attributes.bodyweight"),
							onSelect: () => handleFilter("bodyweight")
						},
						{
							text: t("attributes.freeweight"),
							onSelect: () => handleFilter("freeweight")
						}
					]}
				/>
			</View>

			{exercisesList.map((expr) => (
				<ExerciseCard
					exercise={expr.exercise}
					onPress={
						isSelectionView ? handleSelectExercise : goToExercise
					}
					isSelectable={isSelectionView}
					key={expr.exercise.id}
				/>
			))}

			{isSelectionView ? (
				<Button
					title={
						selectedExercises.length < 2
							? t("actions.add-exercise")
							: t("actions.add-exercises-(count)", {
									count: selectedExercises.length
								})
					}
					onPress={handleAddSelectedExercises}
					icon="plus"
					size="l"
					isDisabled={selectedExercises.length === 0}
					alignSelf
					style={styles.addSelectedExercisesBtn}
				/>
			) : (
				<IconButton
					icon="plus"
					onPress={goToCreateExercise}
					size="xl"
					withPadding
					style={styles.createExerciseBtn}
				/>
			)}
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
		paddingHorizontal: theme.spacing.s,
		paddingBottom: theme.spacing.x4l
	},
	createExerciseBtn: {
		position: "absolute",
		bottom: theme.spacing.xl,
		right: theme.spacing.xl
	},
	actionsContainer: {
		gap: theme.spacing.s,
		marginBottom: theme.spacing.s
	},
	listActionContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	addSelectedExercisesBtn: {
		position: "absolute",
		bottom: theme.spacing.xl
	}
})
