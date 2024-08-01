import { RefObject } from "react"

/** IE Browser 체크 */
export const isInternetExplorer = () => {
    const agent = navigator.userAgent.toLowerCase()
    return agent.indexOf("trident") != -1 || agent.indexOf("msie") != -1
}

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
