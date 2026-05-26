import type { Translations } from "./resources/en"

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: "translation"
		resources: {
			translation: Translations
		}
		returnNull: false
	}
}
