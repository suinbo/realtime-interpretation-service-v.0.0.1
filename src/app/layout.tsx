import cx from "classnames"
import "@assets/styles/common.scss"
import Provider from "./Provider"
import { notoSansKr, roboto } from "@utils/font"

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
