import { Button } from "@components/form"
import LoadingDot from "@components/LoadingDot"
import cx from "classnames"

type ChatMessageProp = {
    msg_id: string
    msg_content: string
    speaker_id: string
    msg_trans_content: string
    isRecording: boolean
    userId: string
    startRecording: () => void
}

const ChatMessage = ({
    msg_id,
    msg_content,
    speaker_id,
    msg_trans_content,
    isRecording,
    userId,
    startRecording,
}: ChatMessageProp) => {
    return (
        <li key={msg_id} className={cx("chatting__item", { my: speaker_id == userId })}>
            <div className="chatting__item--user">
                <span className="profile" />
            </div>
            <div className="chatting__item--text">
                {msg_content ? (
                    <div className="text-item">
                        <div className="text-item--audio-text ">
                            <span className="typo t17 w500">{msg_content}</span>
                            <span className="trans typo t14 w400">{msg_trans_content}</span>
                        </div>
                        <div className="text-item--translation-text">
                            <span className="typo t12 w500">Translation</span>
                            <p className="typo t17">{msg_trans_content}</p>
                        </div>
                    </div>
                ) : isRecording ? (
                    <LoadingDot />
                ) : (
                    <Button text="음성 인식 시작" onClick={startRecording} classname="starter" />
                )}
            </div>
        </li>
    )
}
export default ChatMessage
