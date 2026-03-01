import {
	DatabaseExercise,
	ExerciseFilterBy,
	ExerciseSortBy,
	ExerciseWithProgressions
} from "../../../types/exercises"
import {
	parseExerciseFilterByToText,
	parseExerciseSortByToText
} from "../../../utils/parsing"
import { GETUSEREXERCISESANDPROGRESSIONS_KEY } from "../../../hooks/useExercisesQuery"
import { invalidateQueries } from "../../../utils/queriesHelpers"
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native"
import { RootStackNavigationProp } from "../../../navigation/params"
import { sortExercisesAndProgressionsBy } from "../../../utils/sorting"
import { theme } from "../../../resources/theme"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../../stores/useUserStore"
import Button from "../../../components/buttons/Button"
import ExerciseCard from "../../../components/cards/ExerciseCard"
import IconButton from "../../../components/buttons/IconButton"
import ListActionCard from "../../../components/cards/ListActionCard"

type Props = {
	exercisesWithProgressions: ExerciseWithProgressions[]
	dayId?: number
}
export default function ExerciseRepoInner({
	exercisesWithProgressions,
	dayId
}: Props) {
	const { t } = useTranslation()
	const { user, exercises, routines } = useUserStore()
	const nav = useNavigation<RootStackNavigationProp>()

	const isSelectionView = !!dayId

	const [isRefreshing, setIsRefreshing] = useState(false)
	const [sortBy, setSortBy] = useState<ExerciseSortBy>("ascending")
	const [filterBy, setFilterBy] = useState<ExerciseFilterBy>("all")
	const [exercisesList, setExercisesList] = useState<
		ExerciseWithProgressions[]
	>(exercisesWithProgressions)
	const [selectedExercises, setSelectedExercises] = useState<
		DatabaseExercise[]
	>([])

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
		if (!dayId) return

		nav.reset({
			index: 0,
			routes: [
				{
					name: "Tabs",
					params: {
						screen: "RoutinesTab",
						params: {
							screen: "Routine",
							params: {
								id: routines.find((r) =>
									r.days.some((d) => d.id === dayId)
								)?.routine.id
							}
						}
					}
				},
				{
					name: "EditRoutineDay",
					params: {
						id: dayId,
						selectedExercises
					}
				}
			]
		})
		// nav.popTo("EditRoutineDay", {
		// 	id: dayId,
		// 	selectedExercises
		// })
	}

	function goToCreateExercise() {
		nav.navigate("Tabs", {
			screen: "ExercisesTab",
			params: {
				screen: "CreateExercise"
			}
		})
	}

	function goToExercise(exercise: DatabaseExercise) {
		nav.navigate("Tabs", {
			screen: "ExercisesTab",
			params: {
				screen: "EditExercise",
				params: { id: exercise.id }
			}
		})
	}

	function handleRefresh() {
		if (!user) return

		try {
			setIsRefreshing(true)
			invalidateQueries(GETUSEREXERCISESANDPROGRESSIONS_KEY(user.id))
		} catch (err) {
			console.log(err)
		} finally {
			setIsRefreshing(false)
		}
	}

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
			refreshControl={
				<RefreshControl
					refreshing={isRefreshing}
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
