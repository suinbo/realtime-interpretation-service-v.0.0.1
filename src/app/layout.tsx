import { Roboto, Noto_Sans_KR } from "next/font/google"
import cx from "classnames"
import Provider from "./Provider"
import "@assets/styles/common.scss"

const roboto = Roboto({
    subsets: ["latin"], // preload에 사용할 subsets(필수)
    variable: "--roboto", // CSS 변수 방식으로 스타일 지정
    weight: ["100", "400", "700"],
    fallback: ["system-ui", "arial"],
})

const notoSansKr = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ko">
            <body className={cx(notoSansKr.className, roboto.variable)}>
                <Provider>{children}</Provider>
            </body>
        </html>
    )
}
