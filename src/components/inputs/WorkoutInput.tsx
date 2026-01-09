import { Control, Controller, useController } from "react-hook-form"
import { inputStyles } from "./styles"
import { MAX_DESCRIPTION_LENGTH } from "../../resources/constants"
import { TextInput, View } from "react-native"
import { useTranslation } from "react-i18next"
import { WorkoutValues } from "../../utils/valdiationSchemas"
import StyledText from "../texts/StyledText"

type Props = {
	name: keyof WorkoutValues
	control: Control<WorkoutValues>
}

export default function WorkoutInput({ name, control }: Props) {
	const { t } = useTranslation()
	const { field, fieldState } = useController({ name, control })

	const controllerRules = {
		maxLength: MAX_DESCRIPTION_LENGTH
	}

	return (
		<View style={inputStyles.inputContainer}>
			<StyledText type="boldNote" style={inputStyles.label}>
				{t("attributes.description")}
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
						placeholder={t("messages.notes-for-this-routine")}
						maxLength={MAX_DESCRIPTION_LENGTH}
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
