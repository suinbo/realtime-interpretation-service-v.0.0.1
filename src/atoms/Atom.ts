import { atom } from "recoil"
import { VIEW } from "../resources/constant"
import { OptionProp, UserProp } from "src/app/setting/types"
import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"

/** 화면 옵션 */
export const OptionAtom = atom({
    key: "OptionAtom",
    default: {
        view: VIEW.LANGUAGE,
        language: "en",
        display: 2,
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
    default: {} as ChatroomProp,
})

/** 유저 */
export const UserAtom = atom({
    key: "UserAtom",
    default: {} as UserProp,
})
