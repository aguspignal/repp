import { FlatList, StyleSheet, View } from "react-native"
import { isPostgrestError } from "../../utils/queriesHelpers"
import { parseDateToWeekdayMonthDay } from "../../utils/parsing"
import { RootStackScreenProps } from "../../navigation/params"
import { theme } from "../../resources/theme"
import { useMemo, useState } from "react"
import { useUserStore } from "../../stores/useUserStore"
import Button from "../../components/buttons/Button"
import Loading from "../Loading"
import StyledText from "../../components/texts/StyledText"
import useRoutineQuery from "../../hooks/useRoutineQuery"

export default function RoutineDayHistory({
	navigation,
	route
}: RootStackScreenProps<"RoutineDayHistory">) {
	const { routines } = useUserStore()
	const {
		getRoutineDayAllTimeWorkoutsCount,
		getRoutineDayWorkoutsAndSetsInRange
	} = useRoutineQuery()

	const showInGroupsOf = 10

	const { data: allTimeCount, isPending: isPendingCount } =
		getRoutineDayAllTimeWorkoutsCount(route.params.id)

	const [paginationFrom, setPaginationFrom] = useState(0)
	const [paginationTo, setPaginationTo] = useState(showInGroupsOf - 1)

	const { data: workoutsAndSets, isPending } =
		getRoutineDayWorkoutsAndSetsInRange({
			dayId: route.params.id,
			rangeFrom: paginationFrom,
			rangeTo: paginationTo
		})

	const routineDay = routines
		.find((r) => r.days.some((d) => d.id === route.params.id))
		?.days.find((d) => d.id === route.params.id)

	function setPaginationRange(from: number, to: number) {
		setPaginationFrom(from)
		setPaginationTo(to)
	}

	if (isPending || isPendingCount) return <Loading />

	return (
		<View style={styles.container}>
			<StyledText type="subtitle">
				{`${routineDay?.name} history`}
			</StyledText>

			<FlatList
				data={
					workoutsAndSets && !isPostgrestError(workoutsAndSets)
						? workoutsAndSets
						: []
				}
				renderItem={({ item: ws }) => (
					<View key={ws.workout.id}>
						<StyledText type="text">{`w.id ${
							ws.workout.id
						}, ${parseDateToWeekdayMonthDay(
							new Date(ws.workout.date)
						)}: ${ws.sets.length} sets`}</StyledText>
					</View>
				)}
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
		paddingBottom: theme.spacing.xxl,
		gap: theme.spacing.l
	},
	paginationContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: theme.spacing.xxs
	}
})
