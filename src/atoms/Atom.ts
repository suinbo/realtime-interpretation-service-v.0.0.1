import { atom } from "recoil"
import { VIEW } from "../resources/constant"
import { OptionProp } from "src/app/setting/types"

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
