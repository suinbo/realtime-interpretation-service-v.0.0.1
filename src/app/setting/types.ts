import { NAV, STEP, VIEW } from "@resources/constant"
import { User } from "@supabase/supabase-js"
import { RefObject } from "react"

export type StepProp = (typeof STEP)[keyof typeof STEP]
export type NavProp = (typeof NAV)[keyof typeof NAV]
export type ViewProp = (typeof VIEW)[keyof typeof VIEW]

/** 유저 타입 */
export type UserProp = User | { email: string; name: string; image: string }

/** 설정 옵션 */
export type OptionProp = {
    [key: string]: string | number | FormItemProp
    view: ViewProp
    language: string
    display: number
    chatting: FormItemProp
}

export type InputRefs = {
    nameRef: RefObject<HTMLInputElement | null>
    passwordRef: RefObject<HTMLInputElement | null>
}

export type LabelOfStepProp = {
    [key: string]: {
        nav: NavProp
        title: string
    }
}
export type SettingContentProp = {
    [key: number]: {
        [key: string]: React.ReactNode
    }
}

export type FormItemProp = {
    chat_id: string
    chat_nm: string
    chat_lang: string[]
    has_chat_pw?: boolean
    chat_pw: string | null
    host_auth: number
    room_option?: number
}

export type SelectboxItemProp = {
    id: string
    name: string
}

export type LoginProp = {
    email?: string
    password: string
    rePassword?: string
}
