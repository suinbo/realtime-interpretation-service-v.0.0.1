import { Noto_Sans_JP, Noto_Sans_KR, Noto_Sans_SC, Roboto } from "next/font/google"

export const roboto = Roboto({
    subsets: ["latin"], // preload에 사용할 subsets(필수)
    variable: "--roboto", // CSS 변수 방식으로 스타일 지정
    weight: ["100", "400", "700"],
    fallback: ["system-ui", "arial"],
})

export const notoSansKr = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export const notoSansJp = Noto_Sans_JP({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export const notoSansSc = Noto_Sans_SC({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})
