import { ErrorCode } from "react-i18next"
import { PostgrestError } from "@supabase/supabase-js"
import { queryClient } from "../lib/reactquery"
import i18next from "i18next"
import ToastNotification from "../components/notifications/ToastNotification"

export function notifyIfRequestError(
	response: any | PostgrestError | null,
	notifyIfNull = true,
	message?: string
) {
	if (!message) message = i18next.t("error-messages.ups-error-ocurred")

	if (notifyIfNull && (response === undefined || response === null))
		ToastNotification({ title: message })
	if (isPostgrestError(response))
		ToastNotification({
			title: i18next.t(parseSupabaseErrorToTranslation(response.code))
		})
}

export function parseSupabaseErrorToTranslation(
	code: ErrorCode | (string & {}) | undefined
) {
	return `supabase-error-codes.${code}` as unknown as TemplateStringsArray
}

export function invalidateQueries(key: (string | number)[]) {
	queryClient.invalidateQueries({ queryKey: key })
}

export function isPostgrestError(elem: any) {
	return elem instanceof PostgrestError
}

export function handleOnMutationError(error: Error) {
	console.log(error)
	ToastNotification({
		title: i18next.t("error-messages.an-error-ocurred-try-again")
	})
}
