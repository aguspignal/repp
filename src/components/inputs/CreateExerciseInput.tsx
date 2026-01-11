import {
	MAX_DESCRIPTION_LENGTH,
	MAX_NAME_LENGTH
} from "../../resources/constants"
import { Control, Controller, useController } from "react-hook-form"
import { CreateExerciseValues } from "../../utils/zodSchemas"
import { inputStyles } from "./styles"
import { TextInput, View } from "react-native"
import { useTranslation } from "react-i18next"
import StyledText from "../texts/StyledText"

type Props = {
	name: keyof CreateExerciseValues
	control: Control<CreateExerciseValues>
}

export default function CreateExerciseInput({ name, control }: Props) {
	const { t } = useTranslation()
	const { field, fieldState } = useController({ name, control })

	const label =
		name === "name" ? t("attributes.name") : t("attributes.description")

	const placeholder =
		name === "name"
			? t("attributes.name")
			: t("messages.notes-for-this-exercise")

	const controllerRules = {
		required: name === "name",
		maxLength: name === "name" ? MAX_NAME_LENGTH : MAX_DESCRIPTION_LENGTH
	}

	return (
		<View style={inputStyles.inputContainer}>
			<StyledText type="boldNote" style={inputStyles.label}>
				{label}
			</StyledText>

			<Controller
				name={name}
				control={control}
				rules={controllerRules}
				render={() => (
					<View>
						<TextInput
							onChangeText={field.onChange}
							onBlur={field.onBlur}
							value={field.value}
							style={inputStyles.filledInput}
							placeholder={placeholder}
						/>
					</View>
				)}
			/>

			{fieldState.error ? (
				<StyledText
					type="boldNote"
					color="danger"
					style={inputStyles.errorMessage}
				>
					{fieldState.error.message}
				</StyledText>
			) : null}
		</View>
	)
}
