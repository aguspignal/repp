import {
	MAX_CODE_LENGTH,
	MAX_DESCRIPTION_LENGTH,
	MAX_NAME_LENGTH,
	MIN_PASSWORD_LENGTH
} from "../resources/constants"
import * as yup from "yup"
import i18next from "i18next"

export const SignInValidationSchema = yup.object().shape({
	email: yup
		.string()
		.trim()
		.matches(
			/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
			i18next.t("error-messages.invalid-email")
		)
		.required(i18next.t("error-messages.required")),
	password: yup.string().required(i18next.t("error-messages.required"))
})

export const SignUpValidationSchema = yup.object().shape({
	email: yup
		.string()
		.trim()
		.matches(
			/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
			i18next.t("error-messages.invalid-email")
		)
		.required(i18next.t("error-messages.required")),
	password: yup
		.string()
		.min(
			MIN_PASSWORD_LENGTH,
			({ min }) => `La contraseña debe tener al menos ${min} caracteres`
		)
		.required(i18next.t("error-messages.required")),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password")], "Las contraseñas no coinciden")
		.required(i18next.t("error-messages.required"))
})

export const CreateExerciseValidationSchema = yup.object().shape({
	name: yup
		.string()
		.trim()
		.max(MAX_NAME_LENGTH, i18next.t("error-messages.too-long"))
		.required(i18next.t("error-messages.required")),
	description: yup
		.string()
		.trim()
		.max(MAX_DESCRIPTION_LENGTH, i18next.t("error-messages.too-long"))
})

export const EditRoutineDayValidationSchema = yup.object().shape({
	code: yup
		.string()
		.trim()
		.max(
			MAX_CODE_LENGTH,
			i18next.t("error-messages.cant-be-more-than-3-digits")
		)
		.required(i18next.t("error-messages.required")),
	name: yup
		.string()
		.trim()
		.max(MAX_NAME_LENGTH, i18next.t("error-messages.too-long"))
		.required(i18next.t("error-messages.required"))
})
