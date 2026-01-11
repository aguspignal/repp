import {
	MAX_CODE_LENGTH,
	MAX_DESCRIPTION_LENGTH,
	MAX_NAME_LENGTH,
	MAX_PASSWORD_LENGTH,
	MIN_PASSWORD_LENGTH
} from "../resources/constants"
import * as z from "zod"
import i18next from "i18next"

export const SignInSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(
			MIN_PASSWORD_LENGTH,
			i18next.t(
				"error-messages.password-must-have-at-least-(minCharacters)-charactes",
				{ minCharacters: MIN_PASSWORD_LENGTH }
			)
		)
		.max(MAX_PASSWORD_LENGTH, i18next.t("error-messages.too-long"))
})
export type SignInValues = z.infer<typeof SignInSchema>

export const SignUpSchema = z
	.object({
		email: z
			.string()
			.trim()
			.regex(
				/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
				i18next.t("error-messages.invalid-email")
			),
		password: z
			.string()
			.min(
				MIN_PASSWORD_LENGTH,
				i18next.t(
					"error-messages.password-must-have-at-least-(minCharacters)-charactes",
					{ minCharacters: MIN_PASSWORD_LENGTH }
				)
			)
			.max(MAX_PASSWORD_LENGTH, i18next.t("error-messages.too-long")),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: i18next.t("error-messages.passwords-dont-match")
	})
export type SignUpValues = z.infer<typeof SignUpSchema>

export const CreateExerciseSchema = z.object({
	name: z
		.string()
		.trim()
		.max(MAX_NAME_LENGTH, i18next.t("error-messages.too-long")),
	description: z
		.string()
		.trim()
		.max(MAX_DESCRIPTION_LENGTH, i18next.t("error-messages.too-long"))
		.optional()
})
export type CreateExerciseValues = z.infer<typeof CreateExerciseSchema>

export const EditRoutineDaySchema = z.object({
	code: z
		.string()
		.trim()
		.max(
			MAX_CODE_LENGTH,
			i18next.t("error-messages.cant-be-more-than-3-digits")
		),
	name: z
		.string()
		.trim()
		.max(MAX_NAME_LENGTH, i18next.t("error-messages.too-long"))
})
export type EditRoutineDayValues = z.infer<typeof EditRoutineDaySchema>

export const EditRoutineSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, i18next.t("error-messages.required"))
		.max(MAX_NAME_LENGTH, i18next.t("error-messages.too-long"))
		.regex(/^[\p{L}0-9][\p{L}0-9 \-\/()]*$/u),
	description: z
		.string()
		.trim()
		.max(MAX_DESCRIPTION_LENGTH, i18next.t("error-messages.too-long"))
		.optional()
})
export type EditRoutineValues = z.infer<typeof EditRoutineSchema>

export const WorkoutSchema = z.object({
	note: z
		.string()
		.trim()
		.max(MAX_DESCRIPTION_LENGTH, i18next.t("error-messages.too-long"))
		.optional()
})
export type WorkoutValues = z.infer<typeof WorkoutSchema>
