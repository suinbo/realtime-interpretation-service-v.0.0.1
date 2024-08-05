"use client"

import { useTranslation } from "next-i18next"
import { Noto_Sans_JP, Noto_Sans_KR, Noto_Sans_SC, Roboto } from "next/font/google"
import React, { Suspense, useEffect, useState } from "react"
import { RecoilRoot } from "recoil"

const roboto = Roboto({
    subsets: ["latin"], // preload에 사용할 subsets(필수 지정)
    weight: ["100", "400", "700"],
    variable: "--roboto", // CSS 변수 방식으로 스타일 지정
    fallback: ["system-ui", "arial"],
})

export const notoSansKr = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

const notoSansJp = Noto_Sans_JP({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

const notoSansSc = Noto_Sans_SC({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export default function Provider({ children }: { children: React.ReactNode }) {
    const { i18n } = useTranslation()
    const [fontClass, setFontClass] = useState<string>("")

    useEffect(() => {
        // 폰트 클래스를 동적으로 변경합니다.
        const locale = i18n.language

        switch (locale) {
            case "em":
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

    return (
        <Suspense>
            <RecoilRoot>
                <div className={fontClass}>{children}</div>
            </RecoilRoot>
        </Suspense>
    )
}
