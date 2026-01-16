import { FlatList, StyleSheet, View } from "react-native"
import { isPostgrestError } from "../../utils/queriesHelpers"
import { parseWorkoutHistorySortByToText } from "../../utils/parsing"
import { RootStackScreenProps } from "../../navigation/params"
import { sortWorkoutsByDate } from "../../utils/sorting"
import { theme } from "../../resources/theme"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { WorkoutAndSets, WorkoutHistorySortBy } from "../../types/routines"
import Button from "../../components/buttons/Button"
import ListActionCard from "../../components/cards/ListActionCard"
import Loading from "../Loading"
import RoutineDayHistoryCard from "../../components/cards/RoutineDayHistoryCard"
import useRoutineQuery from "../../hooks/useRoutineQuery"

export default function RoutineDayHistory({
	route
}: RootStackScreenProps<"RoutineDayHistory">) {
	const { t } = useTranslation()
	const {
		getRoutineDayAllTimeWorkoutsCount,
		getRoutineDayWorkoutsAndSetsInRange
	} = useRoutineQuery()

	const showInGroupsOf = 10

	const { data: allTimeCount, isPending: isPendingCount } =
		getRoutineDayAllTimeWorkoutsCount(route.params.id)

	const [paginationFrom, setPaginationFrom] = useState(0)
	const [paginationTo, setPaginationTo] = useState(showInGroupsOf - 1)
	const [sortBy, setSortBy] = useState<WorkoutHistorySortBy>("newest")
	const [workoutsAndSets, setWorkoutsAndSets] = useState<WorkoutAndSets[]>([])

	const { data, isPending } = getRoutineDayWorkoutsAndSetsInRange({
		dayId: route.params.id,
		rangeFrom: paginationFrom,
		rangeTo: paginationTo
	})

	function setPaginationRange(from: number, to: number) {
		setPaginationFrom(from)
		setPaginationTo(to)
	}

	function handleSort(by: WorkoutHistorySortBy) {
		setSortBy(by)
		setWorkoutsAndSets((prev) => sortWorkoutsByDate(prev, by))
	}

	useEffect(() => {
		if (data && !isPostgrestError(data))
			setWorkoutsAndSets(sortWorkoutsByDate(data, sortBy))
	}, [data])

	if (isPending || isPendingCount) return <Loading />

	return (
		<View style={styles.container}>
			{/* <ListActionCard
				title="View"
				triggerLabel={viewPer === "Set" ? "Per set" : "Per progression"}
				options={[
					{
						text: "Per set",
						onSelect: () => setViewPer("Set")
					},
					{
						text: "Per progression",
						onSelect: () => setViewPer("Progression")
					}
				]}
			/> */}

			<ListActionCard
				title={t("actions.sort")}
				triggerLabel={parseWorkoutHistorySortByToText(sortBy)}
				options={[
					{
						text: t("messages.newest-first"),
						onSelect: () => handleSort("newest")
					},
					{
						text: t("messages.oldest-first"),
						onSelect: () => handleSort("oldest")
					}
				]}
			/>

			<FlatList
				data={workoutsAndSets}
				renderItem={({ item, index }) => (
					<RoutineDayHistoryCard
						key={item.workout.id}
						workout={item.workout}
						sets={item.sets}
						isFirstInList={index === 0}
					/>
				)}
				contentContainerStyle={styles.workoutsContainer}
			/>

			<PaginationActions
				n={
					allTimeCount && !isPostgrestError(allTimeCount)
						? allTimeCount
						: 0
				}
				groupsOf={showInGroupsOf}
				indexGroupsOf={5}
				onChangePagination={setPaginationRange}
			/>
		</View>
	)
}

type Props = {
	n: number
	groupsOf: number
	indexGroupsOf: number
	onChangePagination: (from: number, to: number) => void
}
function PaginationActions({
	n,
	groupsOf,
	indexGroupsOf,
	onChangePagination
}: Props) {
	const [indexOffset, setIndexOffset] = useState(0)

	const pages = useMemo(() => Math.ceil(n / groupsOf), [n])

	function handleChangePagination(index: number) {
		const from = index * groupsOf
		const to = from + groupsOf - 1
		onChangePagination(from, to)
	}

	function handleChangeIndexing(direction: "up" | "down") {
		if (direction === "down")
			setIndexOffset((prev) =>
				prev < indexGroupsOf ? 0 : prev - indexGroupsOf
			)

		if (direction === "up")
			setIndexOffset((prev) =>
				prev + indexGroupsOf > pages - indexGroupsOf
					? pages - indexGroupsOf
					: prev + indexGroupsOf
			)
	}

	return (
		<View style={styles.paginationContainer}>
			{indexOffset === 0 ? null : (
				<Button
					title="<"
					onPress={() => handleChangeIndexing("down")}
					color="grayDark"
					isBordered
				/>
			)}

			{Array.from(
				{
					length: indexGroupsOf > pages ? pages : indexGroupsOf
				},
				(_, index) => (
					<Button
						key={index}
						title={`${index + indexOffset + 1}`}
						onPress={() =>
							handleChangePagination(index + indexOffset)
						}
					/>
				)
			)}

			{indexGroupsOf > pages ||
			indexOffset === pages - indexGroupsOf ? null : (
				<Button
					title=">"
					onPress={() => handleChangeIndexing("up")}
					color="grayDark"
					isBordered
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		paddingHorizontal: theme.spacing.s,
		paddingTop: theme.spacing.xxs
	},
	listActionContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	paginationContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: theme.spacing.xxs,
		paddingVertical: theme.spacing.xs
	},
	workoutsContainer: {
		gap: theme.spacing.xxs
	}
})
