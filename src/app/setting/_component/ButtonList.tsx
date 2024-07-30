"use client"

import { useRecoilState } from "recoil"
import { Button } from "@components/form"
import { OptionAtom } from "@atoms/Atom"
import cx from "classnames"
import { useTranslation } from "next-i18next"
import enTranslations from "@resources/locales/en/common.json"
import koTranslations from "@resources/locales/ko/common.json"
import zhTranslations from "@resources/locales/zh/common.json"
import jaTranslations from "@resources/locales/ja/common.json"
import i18next from "@resources/locales/i18n"
import { useEffect } from "react"
import { initReactI18next } from "react-i18next"

const ButtonList = ({ items, content }: { items: { id: number | string; name: string }[]; content: string }) => {
    const [option, setOption] = useRecoilState(OptionAtom)
    const { t, i18n } = useTranslation()

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

    return items.map(item => {
        const { id, name } = item
        const active = option[content] == id

        return (
            <li className="content__item" key={id}>
                <Button
                    theme="checker"
                    classname={cx("typo t18", { active })}
                    onClick={() => {
                        setOption(prev => ({ ...prev, [content]: id }))
                        i18n.changeLanguage(id as string)
                    }}>
                    <div className="checker-item">
                        <span className={cx("checker-item-checkbox", { active })} />
                        <span>{name}</span>
                    </div>
                </Button>
            </li>
        )
    })
}

export default ButtonList
