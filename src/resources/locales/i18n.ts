// lib/i18n.ts
import i18next from "i18next"
import { initReactI18next } from "react-i18next"
import enTranslations from "@resources/locales/en/common.json"
import koTranslations from "@resources/locales/ko/common.json"
import zhTranslations from "@resources/locales/zh/common.json" // 중국어 번역 파일
import jaTranslations from "@resources/locales/ja/common.json" // 일본어 번역 파일

i18next.use(initReactI18next).init({
    resources: {
        en: { translation: enTranslations },
        ko: { translation: koTranslations },
        zh: { translation: zhTranslations },
        ja: { translation: jaTranslations },
    },
    lng: "ko",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
})

export default i18next
