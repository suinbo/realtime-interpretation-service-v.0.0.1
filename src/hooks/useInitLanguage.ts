import enTranslations from "@resources/locales/en/common.json"
import koTranslations from "@resources/locales/ko/common.json"
import zhTranslations from "@resources/locales/zh/common.json"
import jaTranslations from "@resources/locales/ja/common.json"
import i18next from "@resources/locales/i18n"
import { initReactI18next } from "react-i18next"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"
import { useRecoilValue } from "recoil"
import { OptionAtom } from "@atoms/Atom"

export const useInitLanguage = (lang?: string) => {
    const { t, i18n } = useTranslation()
    const options = useRecoilValue(OptionAtom)

    useEffect(() => {
        i18next.use(initReactI18next).init({
            resources: {
                en: { translation: enTranslations },
                ko: { translation: koTranslations },
                zh: { translation: zhTranslations },
                ja: { translation: jaTranslations },
            },
            lng: lang ?? options.language,
            fallbackLng: "en",
            interpolation: {
                escapeValue: false,
            },
        })
    }, [options, lang])

    return { t, i18n }
}
