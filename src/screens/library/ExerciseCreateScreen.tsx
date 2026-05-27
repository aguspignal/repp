import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Screen } from "../../components/ui"
import { ExerciseForm, type ExerciseFormValues } from "../../components/exercises/ExerciseForm"
import { useCreateExerciseWithProgressions } from "../../hooks/useExercises"
import type { RootStackParamList } from "../../navigation/types"

type Props = NativeStackScreenProps<RootStackParamList, "ExerciseCreate">

export const ExerciseCreateScreen = ({ navigation }: Props) => {
	const { t } = useTranslation()
	const createExercise = useCreateExerciseWithProgressions()
	const [formError, setFormError] = useState<string | null>(null)

	const onSubmit = async (values: ExerciseFormValues) => {
		setFormError(null)
		try {
			await createExercise.mutateAsync({
				exercise: {
					name: values.name,
					description: values.description,
					type: values.type,
					move_pattern: values.movePattern,
					is_isometric: values.isIsometric,
					is_weighted: values.isWeighted,
				},
				progressions: values.progressions.map(p => ({
					name: p.name,
					order: p.order,
				})),
			})
			navigation.goBack()
		} catch (err) {
			setFormError(err instanceof Error ? err.message : t("exerciseForm.errors.generic"))
		}
	}

	return (
		<Screen padding="s" edges={["bottom"]}>
			<ExerciseForm
				submitLabel={t("exerciseForm.submit")}
				submitting={createExercise.isPending}
				formError={formError}
				onSubmit={onSubmit}
			/>
		</Screen>
	)
}
