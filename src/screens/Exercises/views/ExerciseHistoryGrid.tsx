import {
	formatExerciseHistorySets,
	parseDateStringToMonthDay
} from "../../../utils/parsing"
import { DatabaseProgression } from "../../../types/exercises"
import { ExerciseHistoryPerWorkout } from "../../../types/workouts"
import { Fragment, ReactNode } from "react"
import { ScrollView } from "react-native-actions-sheet"
import { StyleSheet, View } from "react-native"
import { theme } from "../../../resources/theme"
import { useTranslation } from "react-i18next"
import StyledText from "../../../components/texts/StyledText"

type GridProps = {
	filteredProgressions: DatabaseProgression[]
	historyDataPerWorkout: ExerciseHistoryPerWorkout[]
}
export function ExerciseHistoryGrid({
	filteredProgressions,
	historyDataPerWorkout
}: GridProps) {
	const { t } = useTranslation()

	return (
		<View style={styles.grid}>
			<Column>
				<Cell content={t("titles.progressions")} isBold />
				{filteredProgressions.map((p) => (
					<Cell key={p.id} content={p.name} withMaxWidth />
				))}
			</Column>

			<ScrollView horizontal>
				{historyDataPerWorkout.map((h) => (
					<Column key={h.workoutId}>
						<Cell
							content={parseDateStringToMonthDay(h.workoutDate)}
							isBold
							isCentered
						/>

						{filteredProgressions.map((p) => {
							const totalSets = h.progressions.reduce(
								(sum, p) => sum + p.sets.length,
								0
							)

							const progSetsData = h.progressions.find(
								(pr) => pr.progressionId === p.id
							)

							const content = progSetsData
								? formatExerciseHistorySets(
										progSetsData.sets,
										totalSets
									)
								: ""

							return (
								<Cell key={p.id} content={content} isCentered />
							)
						})}
					</Column>
				))}
			</ScrollView>
		</View>
	)
}

type ColumnProps = {
	children: ReactNode
}
function Column({ children }: ColumnProps) {
	return <View>{children}</View>
}

type CellProps = {
	content: string
	isBold?: boolean
	isCentered?: boolean
	withMaxWidth?: boolean
}
function Cell({
	content,
	isBold = false,
	isCentered = false,
	withMaxWidth = false
}: CellProps) {
	const parts = content.split("-")

	return (
		<View style={[styles.cell, withMaxWidth ? styles.cellMaxWidth : null]}>
			<StyledText
				type={isBold ? "boldText" : "text"}
				align={isCentered ? "center" : "left"}
				numberOfLines={1}
				ellipsizeMode="tail"
			>
				{parts.map((part, i) => (
					<Fragment key={`fragment-${i}`}>
						<StyledText
							type={isBold ? "boldText" : "text"}
							color={part.trim() === "_" ? "grayDark" : undefined}
							align={isCentered ? "center" : "left"}
						>
							{part}
						</StyledText>

						{i < parts.length - 1 && (
							<StyledText type={isBold ? "boldText" : "text"}>
								-
							</StyledText>
						)}
					</Fragment>
				))}
			</StyledText>
		</View>
	)
}

const styles = StyleSheet.create({
	grid: {
		flexDirection: "row"
	},
	cell: {
		paddingVertical: theme.spacing.x3s,
		paddingHorizontal: theme.spacing.xxs,
		borderWidth: 1,
		borderColor: theme.colors.grayDark,
		minWidth: 96
	},
	cellMaxWidth: {
		maxWidth: 152
	}
})
