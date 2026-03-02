import {
	createSheetPayload,
	getDateFromAMonthAgo,
	parseDateToMonthDayYear,
	parseExerciseHistoryPerWorkout
} from "../../utils/parsing"
import { useEffect, useState } from "react"
import { DatabaseProgression } from "../../types/exercises"
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { ExerciseHistoryGrid } from "./views/ExerciseHistoryGrid"
import { ExerciseHistoryPerWorkout } from "../../types/workouts"
import { isPostgrestError } from "../../utils/queriesHelpers"
import { RootStackScreenProps } from "../../navigation/params"
import { SheetManager } from "react-native-actions-sheet"
import { sortProgressionsByOrderDesc } from "../../utils/sorting"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../../resources/theme"
import { useTranslation } from "react-i18next"
import { useUserStore } from "../../stores/useUserStore"
import StyledText from "../../components/texts/StyledText"
import useExercisesQuery from "../../hooks/useExercisesQuery"

export default function ExerciseHistory({
	route
}: RootStackScreenProps<"ExerciseHistory">) {
	const { t } = useTranslation()
	const { exercises } = useUserStore()
	const { getExerciseHistory } = useExercisesQuery()

	const exercise = exercises.find((e) => e.exercise.id === route.params.id)

	const [highestProgression, setHighestProgression] = useState<
		DatabaseProgression | undefined
	>(
		exercise?.progressions.find(
			(p) => p.order === exercise.progressions.length
		)
	)

	const [lowestProgression, setLowestProgression] = useState<
		DatabaseProgression | undefined
	>(exercise?.progressions.find((p) => p.order === 1))

	const [fromDate, setFromDate] = useState<Date>(getDateFromAMonthAgo())
	const [toDate, setToDate] = useState<Date>(new Date())
	const [historyDataPerWorkout, setHistoryDataPerWorkout] = useState<
		ExerciseHistoryPerWorkout[]
	>([])

	const { data: historyData, refetch: refetchHistoryData } =
		getExerciseHistory({
			exerciseId: exercise?.exercise.id,
			highestProgressionOrder: highestProgression?.order,
			lowestProgressionOrder: lowestProgression?.order,
			fromDate,
			toDate
		})

	function handlePickProgression(pickHighest: boolean) {
		if (!exercise) return

		SheetManager.show(
			"progressions-list",
			createSheetPayload(
				exercise.progressions.map((p) => ({
					label: p.name,
					onPress: () => onChooseProgression(p, pickHighest)
				}))
			)
		)
	}

	function onChooseProgression(
		progression: DatabaseProgression,
		pickHighest: boolean
	) {
		if (pickHighest) setHighestProgression(progression)
		else setLowestProgression(progression)

		SheetManager.hide("progressions-list")
	}

	const toDateShowMode = (currentMode: "date" | "time") => {
		DateTimePickerAndroid.open({
			value: toDate,
			onChange: (_, selectedDate) => {
				setToDate(selectedDate ?? toDate)
				refetchHistoryData()
			},
			mode: currentMode,
			is24Hour: true,
			firstDayOfWeek: 1
		})
	}

	const fromDateShowMode = (currentMode: "date" | "time") => {
		DateTimePickerAndroid.open({
			value: fromDate,
			onChange: (_, selectedDate) => {
				setFromDate(selectedDate ?? fromDate)
				refetchHistoryData()
			},
			mode: currentMode,
			is24Hour: true,
			firstDayOfWeek: 1
		})
	}

	useEffect(() => {
		if (historyData && !isPostgrestError(historyData))
			setHistoryDataPerWorkout(
				parseExerciseHistoryPerWorkout(historyData)
			)
	}, [historyData])

	const filteredProgressions = sortProgressionsByOrderDesc(
		exercise?.progressions.filter(
			(p) =>
				p.order >= (lowestProgression?.order ?? 0) &&
				p.order <= (highestProgression?.order ?? Infinity)
		) ?? []
	)
	return (
		<View style={styles.container}>
			<StyledText type="title" align="center">
				{exercise?.exercise.name}
			</StyledText>

			<View style={styles.progressionsAndDatesContainer}>
				<View style={styles.highLowProgressionsContainer}>
					<View style={styles.row}>
						<View style={styles.pickerBlock}>
							<StyledText type="text" style={styles.pickerLabel}>
								{t("titles.lowest-progression")}
							</StyledText>
							<TouchableOpacity
								onPress={() => handlePickProgression(false)}
								style={styles.pickerBtn}
							>
								<StyledText
									type="boldText"
									color="textLight"
									style={styles.pickerBtnText}
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{lowestProgression?.name}
								</StyledText>
							</TouchableOpacity>
						</View>

						<View style={styles.pickerBlock}>
							<StyledText type="text" style={styles.pickerLabel}>
								{t("titles.highest-progression")}
							</StyledText>
							<TouchableOpacity
								onPress={() => handlePickProgression(true)}
								style={styles.pickerBtn}
							>
								<StyledText
									type="boldText"
									color="textLight"
									style={styles.pickerBtnText}
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{highestProgression?.name}
								</StyledText>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View style={styles.dateRangeContainer}>
					<View style={styles.row}>
						<View style={styles.pickerBlock}>
							<StyledText type="text" style={styles.pickerLabel}>
								{t("titles.from-date")}
							</StyledText>
							<TouchableOpacity
								onPress={() => fromDateShowMode("date")}
								style={styles.dateBtn}
							>
								<StyledText type="boldText" color="textLight">
									{parseDateToMonthDayYear(fromDate)}
								</StyledText>
							</TouchableOpacity>
						</View>

						<View style={styles.pickerBlock}>
							<StyledText type="text" style={styles.pickerLabel}>
								{t("titles.to-date")}
							</StyledText>
							<TouchableOpacity
								onPress={() => toDateShowMode("date")}
								style={styles.dateBtn}
							>
								<StyledText type="boldText" color="textLight">
									{parseDateToMonthDayYear(toDate)}
								</StyledText>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>

			{historyDataPerWorkout.length === 0 ? (
				<View style={styles.noWorkoutsTextContainer}>
					<StyledText type="text" align="center" color="grayDark">
						{t(
							"messages.no-workouts-this-exercise-in-specified-range"
						)}
					</StyledText>
				</View>
			) : (
				<ExerciseHistoryGrid
					filteredProgressions={filteredProgressions}
					historyDataPerWorkout={historyDataPerWorkout}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundBlack,
		gap: theme.spacing.xxl
	},
	progressionsAndDatesContainer: {
		gap: theme.spacing.m
	},
	highLowProgressionsContainer: {
		paddingHorizontal: theme.spacing.s,
		gap: theme.spacing.xxs
	},
	dateRangeContainer: {
		paddingHorizontal: theme.spacing.s,
		gap: theme.spacing.xxs
	},
	noWorkoutsTextContainer: {
		paddingHorizontal: theme.spacing.s
	},
	row: {
		flexDirection: "row",
		gap: theme.spacing.s
	},
	pickerBlock: {
		flex: 1
	},
	pickerLabel: {
		marginBottom: theme.spacing.xxs
	},
	pickerBtn: {
		backgroundColor: theme.colors.backgroundGray,
		paddingVertical: theme.spacing.xs,
		paddingHorizontal: theme.spacing.s,
		borderRadius: 8
	},
	pickerBtnText: {
		maxWidth: "100%"
	},
	dateBtn: {
		backgroundColor: theme.colors.backgroundGray,
		paddingVertical: theme.spacing.xs,
		paddingHorizontal: theme.spacing.s,
		borderRadius: 8
	}
})
