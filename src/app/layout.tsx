import type { Metadata } from "next"
import { Roboto, Noto_Sans_KR } from "next/font/google"
import cx from "classnames"
import Provider from "./Provider"
import "@assets/styles/common.scss"
import "./globals.scss"

const notoSansKr = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

const roboto = Roboto({
    subsets: ["latin"], // preload에 사용할 subsets(필수 지정)
    weight: ["100", "400", "700"],
    variable: "--roboto", // CSS 변수 방식으로 스타일 지정
    fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
    title: "Realtime-Interpretation-Service",
    description: "Generated by create next app",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ko">
            <Provider>
                <body className={cx(notoSansKr.className, roboto.variable)}>{children}</body>
            </Provider>
        </html>
    )
}
