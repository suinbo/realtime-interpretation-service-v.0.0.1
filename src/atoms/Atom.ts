import { atom } from "recoil"
import { VIEW } from "../resources/constant"
import { LoginProp, OptionProp } from "src/app/setting/types"
import { User } from "@supabase/supabase-js"

/** 화면 옵션 */
export const optionAtom = atom({
    key: "optionAtom",
    default: {
        view: VIEW.LANGUAGE,
        language: "Afrikaans",
        display: 0,
        chatting: {
            chat_nm: "",
            chat_lang: [""],
            has_chat_pw: false,
            chat_pw: "",
            host_auth: 0,
        },
    } as OptionProp,
})

export const UserAtom = atom({
    key: "userAtom",
    default: {} as User,
})
