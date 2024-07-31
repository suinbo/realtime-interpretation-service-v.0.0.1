"use client"

import React from "react"
import { OptionAtom } from "@atoms/Atom"
import { useRecoilValue } from "recoil"
import { Language, Display, Chatting } from "./_view"
import enTranslations from "@resources/locales/en/common.json"
import koTranslations from "@resources/locales/ko/common.json"
import zhTranslations from "@resources/locales/zh/common.json"
import jaTranslations from "@resources/locales/ja/common.json"
import i18next from "@resources/locales/i18n"
import { initReactI18next } from "react-i18next"
import { useEffect } from "react"
import "@assets/styles/common.scss"
import "./style.scss"

const SettingView = () => {
    const { view } = useRecoilValue(OptionAtom)

    useEffect(() => {
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
    }, [])

    const optionView: { [key: string]: React.ReactNode } = {
        language: <Language />,
        display: <Display />,
        chatting: <Chatting />,
    }

    return optionView[view]
}

export default SettingView
