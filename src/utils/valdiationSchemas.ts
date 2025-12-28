import i18next from "i18next"
import * as yup from "yup"

export const SignInValidationSchema = yup.object().shape({
	email: yup
		.string()
		.trim()
		.matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, i18next.t('error-messages.invalid-email'))
		.required(i18next.t('error-messages.required')),
	password: yup.string().required(i18next.t('error-messages.required')),
})

export const SignUpValidationSchema = yup.object().shape({
	email: yup
		.string()
		.trim()
		.matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, i18next.t('error-messages.invalid-email'))
		.required(i18next.t('error-messages.required')),
	password: yup
		.string()
		.min(6, ({ min }) => `La contraseña debe tener al menos ${min} caracteres`)
		.required(i18next.t('error-messages.required')),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password")], "Las contraseñas no coinciden")
		.required(i18next.t('error-messages.required')),
})

export const CreateExerciseValidationSchema = yup.object().shape({
	name: yup
		.string()
		.trim()
		.required(i18next.t('error-messages.required')),
	description: yup.string().trim(),
})