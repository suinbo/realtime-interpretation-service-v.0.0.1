import { RefObject } from "react"
import cookie from "./cookie"

/** IE Browser 체크 */
export const isInternetExplorer = () => {
    const agent = navigator.userAgent.toLowerCase()
    return agent.indexOf("trident") != -1 || agent.indexOf("msie") != -1
}

/** 입력값 유효성 검사 */
export const focusOnEmpty = (refs: { [key: string]: RefObject<HTMLInputElement> }, callback?: () => void) => {
    const hasNonNullRef = Object.keys(refs).filter(key => refs[key].current !== null)

    for (const field of Object.keys(refs)) {
        const ref = refs[field]

        if (ref.current && !ref.current.value) {
            ref.current.focus()
            return
        }
    }

    if (hasNonNullRef) callback && callback()
}

/** UTC+9 (대한민국 시간) 으로 변환 */
export const convertKoreaTime = (timestamp: number) => {
    const kstDate = new Date(timestamp + 9 * 60 * 60 * 1000)
    return kstDate.toISOString().replace("Z", "+09:00")
}

/** 빈 객체 여부 판단 */
export const isEmptyObject = (obj: Object) => Object.entries(obj).length === 0

/** 키보드 키 판단 */
export const isPressController = (e: React.KeyboardEvent<HTMLButtonElement> | KeyboardEvent, key: string) =>
    e.key.toLowerCase() === key

/** 쿠키 파싱*/
export const parsedCookie = (id: string) =>
    cookie.getItem(id) ? JSON.parse(cookie.getItem(id as string) as string) : null

/** 모바일 기기 확인 */
export const isMobileDevice = () => {
    if (typeof window === "undefined") {
        // SSR에서 navigator 인지하지 못하므로
        return false
    }
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
