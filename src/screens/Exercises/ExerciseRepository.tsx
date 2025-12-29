import useExercisesQuery, {
	GETUSEREXERCISESLAZY_KEY
} from "../../hooks/useExercisesQuery"
import { invalidateQueries, isPostgrestError } from "../../utils/queriesHelpers"
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native"
import { RootStackScreenProps } from "../../navigation/params"
import { theme } from "../../resources/theme"
import { useEffect, useState } from "react"
import { useUserStore } from "../../stores/useUserStore"
import IconButton from "../../components/buttons/IconButton"
import ItemCard from "../../components/cards/ExerciseCard"
import {
	DatabaseExercise,
	ExerciseFilterBy,
	ExerciseSortBy
} from "../../types/exercises"
import StyledText from "../../components/texts/StyledText"
import { useTranslation } from "react-i18next"
import DropdownMenu from "../../components/dropdowns/DropdownMenu"
import ListActionCard from "../../components/cards/ListActionCard"
import {
	parseExerciseFilterByToText,
	parseExerciseSortByToText
} from "../../utils/textParsing"

export default function ExerciseRepository({
	navigation
}: RootStackScreenProps<"ExerciseRepository">) {
	const { t } = useTranslation()
	const { user, exercises, loadExercises } = useUserStore()
	const { getUserExercisesLazy } = useExercisesQuery()

	const { data, isFetching } = getUserExercisesLazy(user?.id)

	const [exercisesList, setExercisesList] =
		useState<DatabaseExercise[]>(exercises)
	const [sortBy, setSortBy] = useState<ExerciseSortBy>("ascending")
	const [filterBy, setFilterBy] = useState<ExerciseFilterBy>("all")

	function goToCreateExercise() {
		navigation.navigate("CreateExercise")
	}

	function goToExercise(id: number) {
		navigation.navigate("EditExercise", { id })
	}

	function handleRefresh() {
		invalidateQueries(GETUSEREXERCISESLAZY_KEY(user?.id ?? 0))
	}

	function handleSort(order: ExerciseSortBy) {
		setSortBy(order)

		setExercisesList(
			exercisesList.sort((a, b) => {
				if (order === "type") {
					const weight = (e: DatabaseExercise) =>
						e.is_bodyweight ? 0 : e.is_freeweight ? 1 : 2
					return weight(a) - weight(b)
				}

				return order === "ascending"
					? a.name.localeCompare(b.name)
					: -1 * a.name.localeCompare(b.name)
			})
		)
	}

	function handleFilter(param: ExerciseFilterBy) {
		setFilterBy(param)

		setExercisesList(
			exercises.filter((e) => {
				if (param === "all") return true
				else if (param === "bodyweight") return e.is_bodyweight
				else if (param === "freeweight") return e.is_freeweight
				else return e.is_isometric
			})
		)
	}

	useEffect(() => {
		if (data && !isPostgrestError(data)) {
			loadExercises(data)
			setExercisesList(data)
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
				<View style={styles.listActionContainer}>
					<StyledText type="text">{t("actions.sort")}</StyledText>

					<DropdownMenu
						renderTrigger={
							<ListActionCard
								title={parseExerciseSortByToText(sortBy)}
							/>
						}
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
				</View>

				<View style={styles.listActionContainer}>
					<StyledText type="text">{t("actions.filter")}</StyledText>

					<DropdownMenu
						renderTrigger={
							<ListActionCard
								title={parseExerciseFilterByToText(filterBy)}
							/>
						}
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
			</View>

			{exercisesList.map((exerc) => (
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
	},
	actionsContainer: {
		gap: theme.spacing.s,
		marginBottom: theme.spacing.s
	},
	listActionContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	}
})
