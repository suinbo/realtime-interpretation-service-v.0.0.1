import { ChatroomAtom, UserAtom } from "@atoms/Atom"
import { Button } from "@components/form"
import LoadingDot from "@components/LoadingDot"
import { useTranslation } from "next-i18next"
import React, { useEffect, useRef } from "react"
import { useRecoilValue } from "recoil"
import { isPressController } from "@utils/common"
import { useMultiTrans } from "@hooks/audioSetting"
import { MultiInitChatProp } from "@app/chat/types"
import cx from "classnames"

/** 말풍선 초기 레이아웃 */
const InitChat = ({
    langCd: { langCd, transLangCd },
    type,
    recordStatus,
    mediaRefs,
}: MultiInitChatProp & { type: string }) => {
    const user = useRecoilValue(UserAtom)
    const { room_id, creator_id } = useRecoilValue(ChatroomAtom)
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
            hostId: creator_id,
            userId: user.id,
            roomId: room_id,
            langCd,
            transLangCd,
            isRecording,
            mediaRecorderRef: mediaRef,
            setIsLoading,
            setMessage: recordStatus.setMessage,
        }),
        your: useMultiTrans({
            hostId: creator_id,
            userId: null,
            roomId: room_id,
            langCd: transLangCd,
            transLangCd: langCd,
            isRecording,
            mediaRecorderRef: mediaRef,
            setIsLoading,
            setMessage: recordStatus.setMessage,
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
