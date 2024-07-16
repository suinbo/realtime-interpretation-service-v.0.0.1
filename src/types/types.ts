import { RefObject } from "react"
import { NAV, STEP } from "../resources/constant"

export type InputRefs = {
    nameRef: RefObject<HTMLInputElement | null>
    passwordRef: RefObject<HTMLInputElement | null>
}

export type StepProp = (typeof STEP)[keyof typeof STEP]

export type LabelOfStepProp = {
    [key: string]: {
        nav: (typeof NAV)[keyof typeof NAV]
        title: string
    }
}
export type SettingContentProp = {
    [key: number]: {
        [key: string]: React.ReactNode
    }
}

export type FormItemProp = {
    chat_nm: string
    chat_lang?: string[]
    chat_pw?: string
    host_auth?: number
}

export type SelectboxItemProp = {
    id: string
    name: string
}
