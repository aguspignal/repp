/* eslint-disable import/no-named-as-default-member */
import { getLocales } from "expo-localization"
import i18next from "i18next"
import { initReactI18next } from "react-i18next"

import { en } from "./resources/en"
import { es } from "./resources/es"

export const SUPPORTED_LOCALES = ["en", "es"] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: SupportedLocale = "en"

const isSupported = (code: string | null | undefined): code is SupportedLocale =>
	!!code && (SUPPORTED_LOCALES as readonly string[]).includes(code)

export const detectDeviceLocale = (): SupportedLocale => {
	try {
		const code = getLocales()[0]?.languageCode
		return isSupported(code) ? code : DEFAULT_LOCALE
	} catch {
		return DEFAULT_LOCALE
	}
}

export const initI18n = async (locale: SupportedLocale): Promise<void> => {
	if (i18next.isInitialized) {
		if (i18next.language !== locale) {
			await i18next.changeLanguage(locale)
		}
		return
	}
	await i18next.use(initReactI18next).init({
		resources: {
			en: { translation: en },
			es: { translation: es },
		},
		lng: locale,
		fallbackLng: DEFAULT_LOCALE,
		interpolation: { escapeValue: false },
		returnNull: false,
	})
}

export const changeLanguage = (locale: SupportedLocale): Promise<unknown> =>
	i18next.changeLanguage(locale)

export { i18next }
