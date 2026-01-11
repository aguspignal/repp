import { Control, Controller, useController } from "react-hook-form"
import { inputStyles } from "./styles"
import { MAX_DESCRIPTION_LENGTH } from "../../resources/constants"
import { parseDateToWeekdayMonthDay } from "../../utils/parsing"
import { TextInput, TouchableOpacity, View } from "react-native"
import { useTranslation } from "react-i18next"
import { WorkoutValues } from "../../utils/zodSchemas"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"
import { useState } from "react"

type Props = {
	name: keyof WorkoutValues
	control: Control<WorkoutValues>
	date: Date
}

export default function WorkoutInput({ name, control, date }: Props) {
	const { t } = useTranslation()
	const { field, fieldState } = useController({ name, control })

	const label = parseDateToWeekdayMonthDay(date)

	const controllerRules = {
		maxLength: MAX_DESCRIPTION_LENGTH
	}

	const [hideDescription, setHideDescription] = useState(false)

	return (
		<View style={inputStyles.inputContainer}>
			<View style={inputStyles.labelAndActionContainer}>
				<View style={inputStyles.labelWithIconContainer}>
					<MCIcon name="calendar" size="xxl" />

					<StyledText type="subtitle" style={inputStyles.label}>
						{label}
					</StyledText>
				</View>

				<TouchableOpacity
					onPress={() => setHideDescription((prev) => !prev)}
				>
					<MCIcon
						name={hideDescription ? "chevron-down" : "chevron-up"}
						color="grayDark"
						size="xxl"
					/>
				</TouchableOpacity>
			</View>

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
						multiline={!hideDescription}
						numberOfLines={hideDescription ? 2 : undefined}
						onFocus={() => setHideDescription(false)}
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
