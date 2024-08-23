import { useEffect, useState } from "react"
import { useInitLanguage } from "./useInitLanguage"
import { notoSansJp, notoSansKr, notoSansSc, roboto } from "@utils/font"

export const useFontClass = () => {
    const { i18n } = useInitLanguage()
    const [fontClass, setFontClass] = useState<string>(notoSansKr.className)

    useEffect(() => {
        const locale = i18n.language

        switch (locale) {
            case "en":
                setFontClass(roboto.variable)
                break
            case "ja":
                setFontClass(notoSansJp.className)
                break
            case "zh":
                setFontClass(notoSansSc.className)
                break
            default:
                setFontClass(notoSansKr.className)
                break
        }
    }, [i18n.language])

    return fontClass
}
