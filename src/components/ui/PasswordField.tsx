import { forwardRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Pressable, type TextInputProps, type TextInput as TextInputType } from "react-native"

import { Icon } from "./Icon"
import { TextField } from "./TextField"

type Props = Omit<TextInputProps, "secureTextEntry"> & {
	label?: string
	error?: string | null
	hint?: string
}

export const PasswordField = forwardRef<TextInputType, Props>((props, ref) => {
	const { t } = useTranslation()
	const [visible, setVisible] = useState(false)
	const toggle = () => setVisible(v => !v)

	return (
		<TextField
			ref={ref}
			{...props}
			secureTextEntry={!visible}
			rightAdornment={
				<Pressable
					onPress={toggle}
					hitSlop={8}
					accessibilityRole="button"
					accessibilityLabel={
						visible ? t("common.hidePassword") : t("common.showPassword")
					}
				>
					<Icon
						name={visible ? "eye-off-outline" : "eye-outline"}
						color="grayDark"
						size={20}
					/>
				</Pressable>
			}
		/>
	)
})

PasswordField.displayName = "PasswordField"
