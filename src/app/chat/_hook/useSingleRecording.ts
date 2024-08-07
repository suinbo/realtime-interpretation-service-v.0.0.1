import { UserAtom } from "@atoms/Atom"
import { useTranscriptions } from "@hooks/audioSetting/single/useTranscriptions"
import { useInitLanguage } from "@hooks/useInitLanguage"
import { useQueryParams } from "@hooks/useQueryParams"
import cookie from "@utils/cookie"
import { useState } from "react"
import { useRecoilValue } from "recoil"

/** 상태 관리 훅 */
export const useSingleRecording = () => {
    const { id, langs, host } = useQueryParams()
    const user = useRecoilValue(UserAtom)

    const [{ langCd, transLangCd }, setLangCd] = useState<{ langCd: string; transLangCd: string }>({
        langCd: "",
        transLangCd: "",
    })

    // 언어셋 쿠키 존재 여부
    const hasCookieLangSet = cookie.hasItem("languageSet")
    const getCookiePassedStatus = cookie.getItem("is_passed")

    // 언어셋 초기화
    const [originLang, transLang] = (langs as string).split(",")
    const isHost = host == user.id
    useInitLanguage(hasCookieLangSet ? (cookie.getItem("languageSet") as string) : isHost ? originLang : transLang)

    // isRecording 상태
    const [isRecording, setIsRecording] = useState<boolean>(false)

    const transcriptions = useTranscriptions({
        hostId: host as string,
        userId: user.id,
        roomId: id as string,
        langCd: isHost ? langCd : transLangCd,
        transLangCd: isHost ? transLangCd : langCd,
        isRecording,
    })

    return {
        isRecording,
        setIsRecording,
        transcriptions,
        setLangCd,
        hasCookieLangSet,
        getCookiePassedStatus,
    }
}
