import { Control, Controller, useController } from "react-hook-form"
import { inputStyles } from "./styles"
import { SignUpValues } from "../../utils/valdiationSchemas"
import { TextInput, TouchableOpacity, View } from "react-native"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import MCIcon from "../icons/MCIcon"
import StyledText from "../texts/StyledText"

type Props = {
	name: keyof SignUpValues
	control: Control<SignUpValues>
}

export default function SignUpInput({ name, control }: Props) {
	const { t } = useTranslation()
	const { field, fieldState } = useController({ name, control })

	const [passwordVisible, setPasswordVisible] = useState(false)

	const label =
		name === "email"
			? t("attributes.email")
			: name === "password"
			? t("attributes.password")
			: t("actions.confirm-password")

	const iconName: React.ComponentProps<typeof MCIcon>["name"] =
		name === "email" ? "email" : passwordVisible ? "eye-off-outline" : "eye"

	const controllerRules = {
		required: true,
		maxLength: name === "email" ? 64 : 257,
		minLength: name === "password" || name === "confirmPassword" ? 6 : 1,
		pattern:
			name === "email"
				? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
				: /.+/
	}

	function handleShowPassword() {
		if (name === "password" || name === "confirmPassword")
			setPasswordVisible((prev) => !prev)
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
							keyboardType={
								name === "email" ? "email-address" : "default"
							}
							secureTextEntry={
								(name === "password" ||
									name === "confirmPassword") &&
								!passwordVisible
							}
							style={inputStyles.input}
						/>

						<TouchableOpacity
							onPress={handleShowPassword}
							activeOpacity={1}
							style={inputStyles.rightIconContainer}
						>
							<MCIcon
								name={iconName}
								style={inputStyles.rightIcon}
							/>
						</TouchableOpacity>
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
