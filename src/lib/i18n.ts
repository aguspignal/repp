import { initReactI18next } from "react-i18next"
import i18next from "i18next"
import translationEN from "../locales/en/translation.json"
import translationES from "../locales/es/translation.json"

i18next.use(initReactI18next).init({
	resources: {
		es: { translation: translationES },
		en: { translation: translationEN },
	},
	lng: "en",
	fallbackLng: "en",
	debug: false,
	interpolation: {
		escapeValue: false,
	},
})

export default i18next
