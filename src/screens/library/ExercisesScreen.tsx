import { useNavigation } from "@react-navigation/native"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, Pressable, StyleSheet, View } from "react-native"

import { ExerciseCard } from "../../components/exercises/ExerciseCard"
import {
	Button,
	EmptyState,
	Icon,
	Row,
	Screen,
	SegmentedControl,
	Stack,
	Text,
} from "../../components/ui"
import { useExercises } from "../../hooks/useExercises"
import { theme } from "../../theme"
import {
	EXERCISE_TYPES,
	MOVEMENT_PATTERNS,
	type Exercise,
	type ExerciseType,
	type MovementPattern,
} from "../../types/db"

type SortOrder = "asc" | "desc"
type TriState = "any" | "yes" | "no"
type MovePatternFilter = MovementPattern | "none"

type ChipProps = {
	label: string
	active: boolean
	onPress: () => void
}

const Chip = ({ label, active, onPress }: ChipProps) => (
	<Pressable
		onPress={onPress}
		accessibilityRole="button"
		accessibilityState={{ selected: active }}
		style={({ pressed }) => [
			styles.chip,
			active ? styles.chipActive : styles.chipInactive,
			pressed ? styles.chipPressed : null,
		]}
	>
		<Text variant="caption" color={active ? "textDark" : "textLight"}>
			{label}
		</Text>
	</Pressable>
)

const toggleSetValue = <T,>(set: Set<T>, value: T): Set<T> => {
	const next = new Set(set)
	if (next.has(value)) next.delete(value)
	else next.add(value)
	return next
}

export const ExercisesScreen = () => {
	const { t } = useTranslation()
	const navigation = useNavigation()
	const { data: exercises, isLoading } = useExercises()

	const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
	const [typeFilters, setTypeFilters] = useState<Set<ExerciseType>>(new Set())
	const [movePatternFilters, setMovePatternFilters] = useState<Set<MovePatternFilter>>(new Set())
	const [isometricFilter, setIsometricFilter] = useState<TriState>("any")
	const [weightedFilter, setWeightedFilter] = useState<TriState>("any")
	const [filtersOpen, setFiltersOpen] = useState(false)

	const goCreate = () => navigation.navigate("ExerciseCreate")
	const openExercise = (id: number) => navigation.navigate("ExerciseDetail", { exerciseId: id })

	const activeFiltersCount =
		typeFilters.size +
		movePatternFilters.size +
		(isometricFilter !== "any" ? 1 : 0) +
		(weightedFilter !== "any" ? 1 : 0)

	const filteredExercises = useMemo<Exercise[]>(() => {
		if (!exercises) return []
		const result = exercises.filter(e => {
			if (typeFilters.size > 0 && !typeFilters.has(e.type)) return false
			if (movePatternFilters.size > 0) {
				const key: MovePatternFilter = e.move_pattern ?? "none"
				if (!movePatternFilters.has(key)) return false
			}
			if (isometricFilter !== "any" && e.is_isometric !== (isometricFilter === "yes"))
				return false
			if (weightedFilter !== "any" && e.is_weighted !== (weightedFilter === "yes"))
				return false
			return true
		})
		result.sort((a, b) =>
			sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
		)
		return result
	}, [exercises, typeFilters, movePatternFilters, isometricFilter, weightedFilter, sortOrder])

	const clearFilters = () => {
		setTypeFilters(new Set())
		setMovePatternFilters(new Set())
		setIsometricFilter("any")
		setWeightedFilter("any")
	}

	const sortOptions = [
		{ value: "asc" as const, label: t("exercisesScreen.sortAsc") },
		{ value: "desc" as const, label: t("exercisesScreen.sortDesc") },
	]

	const triOptions = [
		{ value: "any" as const, label: t("exercisesScreen.filterAny") },
		{ value: "yes" as const, label: t("exercisesScreen.filterYes") },
		{ value: "no" as const, label: t("exercisesScreen.filterNo") },
	]

	const toolbar = (
		<Row gap="xxs" align="center">
			<View style={styles.sortWrap}>
				<SegmentedControl
					options={sortOptions}
					value={sortOrder}
					onChange={v => v && setSortOrder(v)}
				/>
			</View>
			<Pressable
				onPress={() => setFiltersOpen(o => !o)}
				accessibilityRole="button"
				accessibilityState={{ expanded: filtersOpen }}
				style={({ pressed }) => [
					styles.filterToggle,
					filtersOpen ? styles.filterToggleActive : null,
					pressed ? styles.chipPressed : null,
				]}
			>
				<Icon
					name="options-outline"
					size={18}
					color={filtersOpen ? "textDark" : "textLight"}
				/>
				<Text
					variant="label"
					color={filtersOpen ? "textDark" : "textLight"}
					numberOfLines={1}
				>
					{t("exercisesScreen.filters")}
				</Text>
				{activeFiltersCount > 0 ? (
					<View style={styles.badge}>
						<Text variant="caption" color="textDark">
							{activeFiltersCount}
						</Text>
					</View>
				) : null}
			</Pressable>
		</Row>
	)

	const filterPanel = filtersOpen ? (
		<Stack gap="s" style={styles.panel}>
			<Stack gap="x3s">
				<Text variant="label">{t("exercisesScreen.filterType")}</Text>
				<Row gap="xxs" wrap>
					{EXERCISE_TYPES.map(type => (
						<Chip
							key={type}
							label={t(`exerciseForm.types.${type}` as const)}
							active={typeFilters.has(type)}
							onPress={() => setTypeFilters(s => toggleSetValue(s, type))}
						/>
					))}
				</Row>
			</Stack>

			<Stack gap="x3s">
				<Text variant="label">{t("exercisesScreen.filterMovePattern")}</Text>
				<Row gap="xxs" wrap>
					{MOVEMENT_PATTERNS.map(mp => (
						<Chip
							key={mp}
							label={t(`exerciseForm.movePatterns.${mp}` as const)}
							active={movePatternFilters.has(mp)}
							onPress={() => setMovePatternFilters(s => toggleSetValue(s, mp))}
						/>
					))}
					<Chip
						label={t("exercisesScreen.movePatternNone")}
						active={movePatternFilters.has("none")}
						onPress={() => setMovePatternFilters(s => toggleSetValue(s, "none"))}
					/>
				</Row>
			</Stack>

			<Stack gap="x3s">
				<Text variant="label">{t("exercisesScreen.filterIsometric")}</Text>
				<SegmentedControl
					options={triOptions}
					value={isometricFilter}
					onChange={v => v && setIsometricFilter(v)}
				/>
			</Stack>

			<Stack gap="x3s">
				<Text variant="label">{t("exercisesScreen.filterWeighted")}</Text>
				<SegmentedControl
					options={triOptions}
					value={weightedFilter}
					onChange={v => v && setWeightedFilter(v)}
				/>
			</Stack>

			{activeFiltersCount > 0 ? (
				<Button
					title={t("exercisesScreen.clearFilters")}
					variant="ghost"
					size="sm"
					onPress={clearFilters}
				/>
			) : null}
		</Stack>
	) : null

	if (isLoading) return <Screen padding="x3s" />

	if (!exercises || exercises.length === 0) {
		return (
			<Screen>
				<Stack gap="l">
					<EmptyState
						icon="barbell-outline"
						title={t("exercisesScreen.empty")}
						description={t("exercisesScreen.emptyDescription")}
					/>
					<Button title={t("exercisesScreen.add")} fullWidth onPress={goCreate} />
				</Stack>
			</Screen>
		)
	}

	return (
		<Screen padding="x3s">
			<Stack gap="xxs" flex={1}>
				<Stack gap="xxs" style={styles.toolbarWrap}>
					{toolbar}
					{filterPanel}
				</Stack>

				{filteredExercises.length === 0 ? (
					<View style={styles.noResults}>
						<EmptyState
							icon="funnel-outline"
							title={t("exercisesScreen.noResults")}
							description={t("exercisesScreen.noResultsDescription")}
						/>
					</View>
				) : (
					<FlatList
						data={filteredExercises}
						keyExtractor={e => String(e.id)}
						contentContainerStyle={{
							gap: theme.spacing.xxs,
							paddingHorizontal: theme.spacing.xxs,
							paddingBottom: theme.spacing.s,
						}}
						renderItem={({ item }) => (
							<ExerciseCard exercise={item} onPress={() => openExercise(item.id)} />
						)}
					/>
				)}

				<Button title={t("exercisesScreen.add")} fullWidth onPress={goCreate} />
			</Stack>
		</Screen>
	)
}

const styles = StyleSheet.create({
	toolbarWrap: {
		paddingHorizontal: theme.spacing.xxs,
		paddingBottom: theme.spacing.xxs,
	},
	sortWrap: { flex: 1 },
	filterToggle: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.x3s,
		paddingVertical: theme.spacing.xs,
		paddingHorizontal: theme.spacing.s,
		borderRadius: theme.radii.s,
		borderWidth: 1,
		borderColor: theme.colors.backgroundGray,
		backgroundColor: theme.colors.backgroundDark,
	},
	filterToggleActive: {
		backgroundColor: theme.colors.primary,
		borderColor: theme.colors.primary,
	},
	badge: {
		minWidth: 20,
		height: 20,
		paddingHorizontal: theme.spacing.x3s,
		borderRadius: theme.radii.pill,
		backgroundColor: theme.colors.backgroundLight,
		alignItems: "center",
		justifyContent: "center",
	},
	panel: {
		paddingVertical: theme.spacing.s,
		paddingHorizontal: theme.spacing.xxs,
		borderRadius: theme.radii.m,
		backgroundColor: theme.colors.backgroundDark,
	},
	chip: {
		paddingVertical: theme.spacing.x3s,
		paddingHorizontal: theme.spacing.xs,
		borderRadius: theme.radii.pill,
		borderWidth: 1,
	},
	chipActive: {
		backgroundColor: theme.colors.primary,
		borderColor: theme.colors.primary,
	},
	chipInactive: {
		backgroundColor: theme.colors.backgroundGray,
		borderColor: theme.colors.backgroundGray,
	},
	chipPressed: { opacity: 0.7 },
	noResults: { flex: 1, paddingHorizontal: theme.spacing.xxs },
})
