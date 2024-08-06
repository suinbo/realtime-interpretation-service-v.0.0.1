import { UserAtom } from "@atoms/Atom"
import { Button } from "@components/form"
import LoadingDot from "@components/LoadingDot"
import { useQueryParams } from "@hooks/useQueryParams"
import cx from "classnames"
import { useTranslation } from "next-i18next"
import { SetStateAction, useEffect, useRef } from "react"
import { useRecoilValue } from "recoil"

type ChatMessageProp = {
    msg_id: string
    msg_content: string
    speaker_id: string
    msg_eng_content: string
    msg_trans_content: string
    isRecording: boolean
    isLoading: boolean
    setIsRecording: React.Dispatch<SetStateAction<boolean>>
    userId: string
    startRecording: () => void
    stopRecording: () => void
}

/** Display 1대 (2인) */
const SingleChatMessage = ({
    msg_id,
    msg_content,
    speaker_id,
    msg_trans_content,
    msg_eng_content,
    isRecording,
    isLoading,
    //userId,
    setIsRecording,
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
                onKeyUp={e => {
                    if (e.key == "V" || e.key == "v") {
                        stopRecording()
                        setIsRecording(false)
                    }
                }}
                onKeyDown={e => {
                    if (!isRecording && (e.key == "V" || e.key == "v")) {
                        startRecording()
                        setIsRecording(true)
                    }
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
        <li key={msg_id} className={cx("chatting__item", { my: speaker_id == id })}>
            <div className="chatting__item--user">
                <span className="profile" />
            </div>
            {/* <div className="chatting__item--text">
                {msg_content ? (
                    <div className="text-item">
                        <div className="text-item--audio-text ">
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
                ) : isRecording ? (
                    <LoadingDot />
                ) : isLoading ? (
                    <LoadingDot />
                ) : (
                    <div>
                        {isRecording ? <LoadingDot /> : <>녹음 대기중</>}
                        <Button
                            text={isRecording ? "stop" : t("recording")}
                            onClick={isRecording ? stopRecording : startRecording}
                            classname="starter"
                        />
                    </div>
                )}
            </div> */}
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
export default SingleChatMessage
