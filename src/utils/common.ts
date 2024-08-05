import { RefObject } from "react"

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
