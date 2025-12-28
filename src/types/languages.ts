import translation from "../locales/en/translation.json"

export const resources = { translation } as const

export enum AppLanguage {
	en = "en",
	es = "es",
}
