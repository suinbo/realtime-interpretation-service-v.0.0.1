import { UserAtom } from "@atoms/Atom"
import { Button } from "@components/form"
import LoadingDot from "@components/LoadingDot"
import { useQueryParams } from "@hooks/useQueryParams"
import { useTranslation } from "next-i18next"
import React, { useEffect, useRef } from "react"
import { useRecoilValue } from "recoil"
import { isPressController } from "@utils/common"
import { useMultiTrans } from "@hooks/audioSetting"
import cx from "classnames"
import { MultiInitChatProp } from "@app/chat/types"

/** 말풍선 초기 레이아웃 */
const InitChat = ({ type, recordStatus, mediaRefs }: MultiInitChatProp) => {
    const user = useRecoilValue(UserAtom)
    const { id, host, langs } = useQueryParams()
    const [originLang, transLang] = (langs as string).split(",")
    const { t } = useTranslation()

    const refs: { [key: string]: React.RefObject<HTMLButtonElement> } = {
        my: useRef<HTMLButtonElement>(null),
        your: useRef<HTMLButtonElement>(null),
    }

    const { isRecording, setIsRecording, isLoading, setIsLoading } = recordStatus[type]
    const mediaRef = mediaRefs[type]
    const buttonRef = refs[type]

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isPressController(e, "v") && refs.my.current) {
                refs.my.current.focus()
            }
            if (isPressController(e, "w") && refs.your.current) {
                refs.your.current.focus()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    const data: { [key: string]: any } = {
        my: useMultiTrans({
            hostId: host as string,
            userId: user.id,
            roomId: id as string,
            langCd: originLang,
            transLangCd: transLang,
            isRecording,
            mediaRecorderRef: mediaRef,
            setIsLoading,
        }),
        your: useMultiTrans({
            hostId: host as string,
            userId: null,
            roomId: id as string,
            langCd: transLang,
            transLangCd: originLang,
            isRecording,
            mediaRecorderRef: mediaRef,
            setIsLoading,
        }),
    }

    return (
        <div className="active-item">
            <Button
                refs={buttonRef}
                onKeyUp={e => {
                    if (isPressController(e, "v") || isPressController(e, "w")) {
                        e.preventDefault()
                        data[type].stopRecording()
                        setIsRecording(false)
                    }
                }}
                onKeyDown={e => {
                    if (!isRecording && (isPressController(e, "v") || isPressController(e, "w"))) {
                        e.preventDefault()
                        data[type].startRecording()
                        setIsRecording(true)
                    }
                }}
                text={isRecording ? t("stop") : isLoading ? "-" : t("start")}
                onClick={() => {
                    if (isRecording) {
                        data[type].stopRecording()
                        setIsRecording(false)
                    } else {
                        data[type].startRecording()
                        setIsRecording(true)
                    }
                }}
                classname={cx("active-item--controller", type)}
                disabled={isLoading}
            />
            {isRecording ? (
                <div className="active-item--loading">
                    <LoadingDot text={t("listening")} type={type} />
                </div>
            ) : isLoading ? (
                <div className="active-item--loading">
                    <LoadingDot text={t("translating")} type={type} />
                </div>
            ) : null}
        </div>
    )
}

export default InitChat
