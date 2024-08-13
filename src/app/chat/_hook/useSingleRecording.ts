import { UserAtom } from "@atoms/Atom"
import { useSingleTrans } from "@hooks/audioSetting"
import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"
import { useInitLanguage } from "@hooks/useInitLanguage"
import { parsedCookie } from "@utils/common"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"

/** 상태 관리 훅 */
export const useSingleRecording = (chatroom: ChatroomProp | null) => {
    const user = useRecoilValue(UserAtom)
    const [langCd, setLangCd] = useState<{ langCd: string; transLangCd: string }>({
        langCd: "",
        transLangCd: "",
    })

    const [{ room_id, creator_id }, setData] = useState<{ room_id: string; creator_id: string }>({
        room_id: "",
        creator_id: "",
    })

    // isRecording 상태
    const [isRecording, setIsRecording] = useState<boolean>(false)

    useEffect(() => {
        if (chatroom) {
            setData({ room_id: chatroom.room_id, creator_id: chatroom.creator_id })
        }
    }, [chatroom])

    // 언어셋 쿠키 존재 여부
    const hasCookieLangSet = parsedCookie(room_id) ? parsedCookie(room_id).languageSet : ""

    // 언어셋 초기화
    const isHost = creator_id == user.id
    useInitLanguage(hasCookieLangSet ? parsedCookie(room_id).languageSet : isHost ? langCd.langCd : langCd.transLangCd)

    const transcriptions = useSingleTrans({
        hostId: creator_id,
        userId: user.id,
        roomId: room_id,
        langCd: isHost ? langCd.langCd : langCd.transLangCd,
        transLangCd: isHost ? langCd.transLangCd : langCd.langCd,
        isRecording,
    })

    return {
        isRecording,
        setIsRecording,
        transcriptions,
        langCd,
        setLangCd,
        hasCookieLangSet,
    }
}
