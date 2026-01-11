import {
	MAX_DESCRIPTION_LENGTH,
	MAX_NAME_LENGTH
} from "../../resources/constants"
import { Control, Controller, useController } from "react-hook-form"
import { EditRoutineValues } from "../../utils/zodSchemas"
import { inputStyles } from "./styles"
import { TextInput, View } from "react-native"
import { useTranslation } from "react-i18next"
import StyledText from "../texts/StyledText"

type Props = {
	name: keyof EditRoutineValues
	control: Control<EditRoutineValues>
}

export default function EditRoutineInput({ name, control }: Props) {
	const { t } = useTranslation()
	const { field, fieldState } = useController({ name, control })

	const label =
		name === "name" ? t("attributes.name") : t("attributes.description")
	const placeholder =
		name === "name"
			? t("attributes.name")
			: t("messages.notes-for-this-routine")

	const maxLength = name === "name" ? MAX_NAME_LENGTH : MAX_DESCRIPTION_LENGTH

	const controllerRules = {
		required: name === "name",
		maxLength
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
					<TextInput
						onChangeText={field.onChange}
						onBlur={field.onBlur}
						value={field.value}
						placeholder={placeholder}
						maxLength={maxLength}
						multiline={name === "description"}
						style={inputStyles.filledInput}
					/>
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
