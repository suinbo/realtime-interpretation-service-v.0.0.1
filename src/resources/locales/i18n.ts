// lib/i18n.ts
import i18next from "i18next"
import { initReactI18next } from "react-i18next"
import enTranslations from "@resources/locales/en/common.json"
import koTranslations from "@resources/locales/ko/common.json"
import zhTranslations from "@resources/locales/zh/common.json"
import jaTranslations from "@resources/locales/ja/common.json"

i18next.use(initReactI18next).init({
    resources: {
        en: { translation: enTranslations },
        ko: { translation: koTranslations },
        zh: { translation: zhTranslations },
        ja: { translation: jaTranslations },
    },
    lng: "en",
    fallbackLng: "ko",
    interpolation: {
        escapeValue: false,
    },
})

export default i18next
