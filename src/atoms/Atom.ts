import { atom } from "recoil"
import { VIEW } from "../resources/constant"
import { FormItemProp, LoginProp, OptionProp } from "src/app/setting/types"
import { User } from "@supabase/supabase-js"

/** 화면 옵션 */
export const OptionAtom = atom({
    key: "OptionAtom",
    default: {
        view: VIEW.LANGUAGE,
        language: "Afrikaans",
        display: 1,
        chatting: {
            chat_nm: "",
            chat_lang: [""],
            has_chat_pw: false,
            chat_pw: null,
            host_auth: 0,
        },
    } as OptionProp,
})

/** 채팅방 설정 */
export const ChatroomAtom = atom({
    key: "ChatroomAtom",
    default: {
        chat_nm: "",
        chat_lang: [""],
        has_chat_pw: false,
        chat_pw: null,
        host_auth: 0,
        room_option: 0,
    } as FormItemProp,
})

/** 유저 */
export const UserAtom = atom({
    key: "UserAtom",
    default: {} as User,
})
