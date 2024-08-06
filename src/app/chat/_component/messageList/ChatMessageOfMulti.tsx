import { SetStateAction } from "react"
import cx from "classnames"

type ChatMessageProp = {
    msg_id: string
    msg_content: string
    speaker_id: string
    msg_eng_content: string
    msg_trans_content: string
    userId: string
    isRecording: boolean
    isLoading: boolean
    startRecording: () => void
    stopRecording: () => void
    setIsRecording: React.Dispatch<SetStateAction<boolean>>
    recordStatus: {
        [key: string]: {
            isRecording: boolean
            setIsRecording: React.Dispatch<SetStateAction<boolean>>
            isLoading: boolean
            setIsLoading: React.Dispatch<SetStateAction<boolean>>
        }
    }
    mediaRefs: {
        [key: string]: any
    }
}

/** Display 2대 (1인) */
const MultiChatMessage = ({ msg_id, msg_content, speaker_id, msg_trans_content, msg_eng_content }: ChatMessageProp) => {
    const MessageContent = ({ type }: { type: string }) =>
        msg_content && (
            <li key={`my_${msg_id}`} className={cx("chatting__item", type)}>
                <div className="chatting__item--user">
                    <span className="profile" />
                </div>
                <div className="chatting__item--text">
                    <div className="text-item">
                        <div className="text-item--audio-text">
                            <span className="typo t17 w500">{speaker_id ? msg_content : msg_trans_content}</span>
                            <span className="trans typo t14 w400">{msg_eng_content}</span>
                        </div>
                        <div className="text-item--translation-text">
                            <span className="typo t12 w500">Translation</span>
                            <p className="typo t17">{speaker_id ? msg_trans_content : msg_content}</p>
                        </div>
                    </div>
                </div>
            </li>
        )

    return <MessageContent type={speaker_id ? "my" : "your"} />
}
export default MultiChatMessage
