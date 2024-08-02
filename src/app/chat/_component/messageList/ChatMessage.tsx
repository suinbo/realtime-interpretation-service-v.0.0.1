import { UserAtom } from "@atoms/Atom"
import { Button } from "@components/form"
import LoadingDot from "@components/LoadingDot"
import { useQueryParams } from "@hooks/useQueryParams"
import cx from "classnames"
import { useTranslation } from "next-i18next"
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
}

const ChatMessage = ({
    msg_id,
    msg_content,
    speaker_id,
    msg_trans_content,
    msg_eng_content,
    isRecording,
    isLoading,
    userId,
    startRecording,
}: ChatMessageProp) => {
    const { id } = useRecoilValue(UserAtom)
    const { host, display } = useQueryParams()
    const { t } = useTranslation()

    return (
        <li key={msg_id} className={cx("chatting__item", { my: speaker_id == userId })}>
            <div className="chatting__item--user">
                <span className="profile" />
            </div>
            <div className="chatting__item--text">
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
                    <Button text={t("recording")} onClick={startRecording} classname="starter" />
                )}
            </div>
        </li>
    )
}
export default ChatMessage
