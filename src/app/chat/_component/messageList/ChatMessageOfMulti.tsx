import { UserAtom } from "@atoms/Atom"
import { Button } from "@components/form"
import LoadingDot from "@components/LoadingDot"
import { useQueryParams } from "@hooks/useQueryParams"
import cx from "classnames"
import { useTranslation } from "next-i18next"
import { useEffect, useRef } from "react"
import { useRecoilValue } from "recoil"

type ChatMessageProp = {
    msg_id: string
    msg_content: string
    speaker_id: string
    msg_eng_content: string
    msg_trans_content: string
    isRecording: boolean
    isLoading: boolean
    userId: string
    startRecording: () => void
    stopRecording: () => void
}

/** Display 2대 (1인) */
const MultiChatMessage = ({
    msg_id,
    msg_content,
    speaker_id,
    msg_trans_content,
    msg_eng_content,
    isRecording,
    isLoading,
    userId,
    startRecording,
    stopRecording,
}: ChatMessageProp) => {
    const { id } = useRecoilValue(UserAtom)
    const { host, display } = useQueryParams()
    const { t } = useTranslation()
    const buttonRefs = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (buttonRefs) {
            buttonRefs.current?.focus()
        }
    }, [])

    const InitChat = () => (
        <div className="active-item">
            <Button
                refs={buttonRefs}
                onKeyDown={e => {
                    if (e.key == "z") startRecording()
                    if (e.key == "x") stopRecording()
                    // if (e.key == "c") startRecording()
                    // if (e.key == "d") stopRecording()
                }}
                text={isRecording ? t("stop") : isLoading ? "-" : t("start")}
                onClick={isRecording ? stopRecording : startRecording}
                classname="active-item--controller"
                disabled={isLoading}
            />
            {isRecording ? (
                <div className="active-item--loading">
                    <LoadingDot text={t("listening")} />
                </div>
            ) : isLoading ? (
                <div className="active-item--loading">
                    <LoadingDot text={t("translating")} />
                </div>
            ) : null}
        </div>
    )

    return (
        <li key={msg_id} className={cx("chatting__item", { my: speaker_id == userId })}>
            <div className="chatting__item--user">
                <span className="profile" />
            </div>
            <div className="chatting__item--text">
                {msg_content ? (
                    <div className="text-item">
                        <div className="text-item--audio-text">
                            <span className="typo t17 w500">{id == host ? msg_content : msg_trans_content}</span>
                            <span className="trans typo t14 w400">{msg_eng_content}</span>
                        </div>
                        {display == 1 && (
                            <div className="text-item--translation-text">
                                <span className="typo t12 w500">Translation</span>
                                <p className="typo t17">{msg_trans_content}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <InitChat />
                )}
            </div>
        </li>
    )
}
export default MultiChatMessage
