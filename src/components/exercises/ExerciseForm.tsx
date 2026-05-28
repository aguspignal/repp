import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native"
import DraggableFlatList, {
	ScaleDecorator,
	type RenderItemParams,
} from "react-native-draggable-flatlist"

import { Banner, Button, Icon, SegmentedControl, Stack, SwitchRow, Text, TextField } from "../ui"
import { theme } from "../../theme"
import {
	EXERCISE_TYPES,
	MOVEMENT_PATTERNS,
	type ExerciseType,
	type MovementPattern,
} from "../../types/db"

export type DraftProgression = {
	id: string
	existingId: number | null
	name: string
}

export type ExerciseFormValues = {
	name: string
	description: string | null
	type: ExerciseType
	movePattern: MovementPattern | null
	isIsometric: boolean
	isWeighted: boolean
	progressions: { existingId: number | null; name: string; order: number }[]
}

export type ExerciseFormInitial = {
	name?: string
	description?: string | null
	type?: ExerciseType | null
	movePattern?: MovementPattern | null
	isIsometric?: boolean
	isWeighted?: boolean
	progressions?: DraftProgression[]
}

type Props = {
	initial?: ExerciseFormInitial
	submitLabel: string
	submitting?: boolean
	formError?: string | null
	lockType?: boolean
	onSubmit: (values: ExerciseFormValues) => void
}

type FieldErrors = {
	name?: string
	type?: string
}

const tempId = () => Math.random().toString(36).slice(2, 10)

const isWeightTrackedType = (t: ExerciseType | null) => t === "freeweight" || t === "machine"

export const ExerciseForm = ({
	initial,
	submitLabel,
	submitting,
	formError,
	lockType,
	onSubmit,
}: Props) => {
	const { t } = useTranslation()

	const [name, setName] = useState(initial?.name ?? "")
	const [description, setDescription] = useState(initial?.description ?? "")
	const [type, setType] = useState<ExerciseType | null>(initial?.type ?? null)
	const [movePattern, setMovePattern] = useState<MovementPattern | null>(
		initial?.movePattern ?? null,
	)
	const [isIsometric, setIsIsometric] = useState<boolean>(initial?.isIsometric ?? false)
	const [isWeighted, setIsWeighted] = useState<boolean>(initial?.isWeighted ?? false)
	const [progressions, setProgressions] = useState<DraftProgression[]>(
		initial?.progressions ?? [],
	)
	const [errors, setErrors] = useState<FieldErrors>({})
	const submittingRef = useRef(false)

	const weightTracked = isWeightTrackedType(type)

	const addProgression = () =>
		setProgressions(p => [...p, { id: tempId(), existingId: null, name: "" }])

	const updateProgression = (id: string, value: string) =>
		setProgressions(p => p.map(x => (x.id === id ? { ...x, name: value } : x)))

	const removeProgression = (id: string) => setProgressions(p => p.filter(x => x.id !== id))

	const handleSubmit = () => {
		if (submittingRef.current || submitting) return
		const fieldErrors: FieldErrors = {}
		if (!name.trim()) fieldErrors.name = t("exerciseForm.errors.nameRequired")
		if (!type) fieldErrors.type = t("exerciseForm.errors.typeRequired")
		setErrors(fieldErrors)
		if (Object.keys(fieldErrors).length > 0) return

		const trimmedName = name.trim()
		const submitWeightTracked = isWeightTrackedType(type)

		let cleanProgressions: { existingId: number | null; name: string; order: number }[]
		if (submitWeightTracked) {
			const firstExistingId = progressions.find(p => p.existingId != null)?.existingId ?? null
			cleanProgressions = [{ existingId: firstExistingId, name: trimmedName, order: 1 }]
		} else {
			const named = progressions.filter(p => p.name.trim().length > 0)
			cleanProgressions = named.map((p, idx) => ({
				existingId: p.existingId,
				name: p.name.trim(),
				order: named.length - idx,
			}))
		}

		submittingRef.current = true
		onSubmit({
			name: trimmedName,
			description: description.trim() || null,
			type: type!,
			movePattern,
			isIsometric,
			isWeighted: submitWeightTracked ? true : isWeighted,
			progressions: cleanProgressions,
		})
		submittingRef.current = false
	}

	const typeOptions = EXERCISE_TYPES.map(value => ({
		value,
		label: t(`exerciseForm.types.${value}` as const),
	}))

	const movePatternOptions = MOVEMENT_PATTERNS.map(value => ({
		value,
		label: t(`exerciseForm.movePatterns.${value}` as const),
	}))

	const renderProgression = ({
		item,
		drag,
		isActive,
		getIndex,
	}: RenderItemParams<DraftProgression>) => {
		const index = getIndex() ?? 0
		const order = progressions.length - index
		return (
			<ScaleDecorator>
				<View
					collapsable={false}
					style={[styles.progressionRow, isActive ? styles.progressionActive : null]}
				>
					<Pressable
						onLongPress={drag}
						disabled={isActive}
						delayLongPress={150}
						hitSlop={6}
						accessibilityRole="button"
						accessibilityLabel={t("exerciseForm.dragHandle")}
						style={({ pressed }) => [styles.handle, pressed ? styles.pressed : null]}
					>
						<Icon name="reorder-three-outline" color="grayDark" size={22} />
					</Pressable>
					<View style={styles.orderBadge}>
						<Text variant="caption" color="textLight">
							{order}
						</Text>
					</View>
					<View style={styles.progressionInput}>
						<TextField
							value={item.name}
							onChangeText={value => updateProgression(item.id, value)}
							placeholder={t("exerciseForm.progressionNamePlaceholder")}
						/>
					</View>
					<Pressable
						onPress={() => removeProgression(item.id)}
						hitSlop={8}
						accessibilityRole="button"
						accessibilityLabel={t("exerciseForm.removeProgression")}
						style={({ pressed }) => [styles.removeBtn, pressed ? styles.pressed : null]}
					>
						<Icon name="close" color="danger" size={20} />
					</Pressable>
				</View>
			</ScaleDecorator>
		)
	}

	const header = (
		<Stack gap="l">
			{formError ? <Banner tone="error" message={formError} /> : null}

			<TextField
				label={`${t("exerciseForm.nameLabel")} *`}
				placeholder={t("exerciseForm.namePlaceholder")}
				value={name}
				onChangeText={setName}
				autoCapitalize="sentences"
				returnKeyType="next"
				error={errors.name}
			/>

			<TextField
				label={t("exerciseForm.descriptionLabel")}
				placeholder={t("exerciseForm.descriptionPlaceholder")}
				value={description ?? ""}
				onChangeText={setDescription}
				multiline
				numberOfLines={3}
				style={styles.multiline}
			/>

			<Stack gap="xxs">
				<Text variant="label">{`${t("exerciseForm.typeLabel")} *`}</Text>
				<SegmentedControl
					options={typeOptions}
					value={type}
					onChange={setType}
					disabled={lockType}
				/>
				{lockType ? (
					<Text variant="caption" color="grayDark">
						{t("exerciseForm.typeLockedHint")}
					</Text>
				) : null}
				{errors.type ? (
					<Text variant="caption" color="danger">
						{errors.type}
					</Text>
				) : null}
			</Stack>

			<Stack gap="xxs">
				<Text variant="label">{t("exerciseForm.movePatternLabel")}</Text>
				<SegmentedControl
					options={movePatternOptions}
					value={movePattern}
					onChange={setMovePattern}
					nullable
				/>
				<Text variant="caption" color="grayDark">
					{t("exerciseForm.movePatternHint")}
				</Text>
			</Stack>

			<Stack>
				<SwitchRow
					label={t("exerciseForm.isIsometric")}
					description={t("exerciseForm.isIsometricDescription")}
					value={isIsometric}
					onChange={setIsIsometric}
				/>
				{weightTracked ? null : (
					<SwitchRow
						label={t("exerciseForm.isWeighted")}
						value={isWeighted}
						onChange={setIsWeighted}
					/>
				)}
			</Stack>

			{weightTracked ? (
				<Banner tone="info" message={t("exerciseForm.weightTrackedNote")} />
			) : (
				<Stack gap="x3s" style={styles.progressionsLabel}>
					<Text variant="label">{t("exerciseForm.progressionsLabel")}</Text>
					<Text variant="caption" color="grayDark">
						{t("exerciseForm.progressionsHint")}
					</Text>
				</Stack>
			)}
		</Stack>
	)

	const footer = (
		<Stack gap="l" style={styles.footer}>
			{weightTracked ? null : (
				<Button
					title={t("exerciseForm.addProgression")}
					variant="secondary"
					size="sm"
					onPress={addProgression}
				/>
			)}
			<Button
				title={submitLabel}
				fullWidth
				size="lg"
				loading={submitting}
				onPress={handleSubmit}
			/>
		</Stack>
	)

	return (
		<KeyboardAvoidingView
			style={styles.flex}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
		>
			<DraggableFlatList
				data={weightTracked ? [] : progressions}
				keyExtractor={p => p.id}
				renderItem={renderProgression}
				onDragEnd={({ data }) => setProgressions(data)}
				activationDistance={8}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				ListHeaderComponent={header}
				ListFooterComponent={footer}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			/>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	flex: { flex: 1 },
	scrollContent: {
		paddingBottom: theme.spacing.x5l,
	},
	multiline: {
		minHeight: 80,
		textAlignVertical: "top",
		paddingTop: theme.spacing.xs,
	},
	progressionsLabel: { marginTop: theme.spacing.s },
	footer: { marginTop: theme.spacing.s },
	separator: { height: theme.spacing.xxs },
	progressionRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.xxs,
		paddingVertical: theme.spacing.x3s,
	},
	progressionActive: {
		backgroundColor: theme.colors.backgroundDark,
		borderRadius: theme.radii.s,
	},
	handle: {
		width: 28,
		height: 32,
		alignItems: "center",
		justifyContent: "center",
	},
	orderBadge: {
		minWidth: 24,
		height: 24,
		paddingHorizontal: theme.spacing.x3s,
		borderRadius: theme.radii.xs,
		backgroundColor: theme.colors.backgroundDark,
		alignItems: "center",
		justifyContent: "center",
	},
	progressionInput: { flex: 1 },
	removeBtn: {
		width: 32,
		height: 32,
		alignItems: "center",
		justifyContent: "center",
	},
	pressed: { opacity: 0.7 },
})
