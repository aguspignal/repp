import { Control, Controller, useController } from "react-hook-form"
import { EditRoutineDayValues } from "../../utils/zodSchemas"
import { inputStyles } from "./styles"
import { MAX_CODE_LENGTH, MAX_NAME_LENGTH } from "../../resources/constants"
import { TextInput, View } from "react-native"
import { useTranslation } from "react-i18next"
import RoutineDayCodeInput from "./RoutineDayCodeInput"
import StyledText from "../texts/StyledText"

type Props = {
	name: keyof EditRoutineDayValues
	control: Control<EditRoutineDayValues>
}

export default function EditRoutineDayInput({ name, control }: Props) {
	const { t } = useTranslation()
	const { field, fieldState } = useController({ name, control })

	const placeholder = name === "name" ? t("attributes.name") : "ABC"

	const controllerRules = {
		required: name === "name",
		maxLength: name === "name" ? MAX_NAME_LENGTH : MAX_CODE_LENGTH
	}

	return (
		<View
			style={[
				inputStyles.inputContainer,
				name === "name" ? inputStyles.stretch : null
			]}
		>
			<Controller
				name={name}
				control={control}
				rules={controllerRules}
				render={() => (
					<View>
						{name === "name" ? (
							<TextInput
								onChangeText={field.onChange}
								onBlur={field.onBlur}
								value={field.value}
								style={[
									inputStyles.filledInput
									// inputStyles.stretch
								]}
								placeholder={placeholder}
							/>
						) : (
							<RoutineDayCodeInput
								onChange={field.onChange}
								onBlur={field.onBlur}
								value={field.value}
								size="m"
							/>
						)}
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
