import { Button } from "@components/form"
import Loading from "./_component/LoadingDot"
import cx from "classnames"

const Chatting = ({
    messages,
    isRecording,
    startRecording,
    userId,
}: {
    messages: any
    isRecording: boolean
    startRecording: () => void
    userId: string
}) => {
    const newMessage = { msg_id: "new", msg_content: "", speaker_id: userId, msg_trans_content: "" }
    return (
        <div className="content__body--chat">
            <ul>
                {[...messages, newMessage].map(({ msg_id, msg_content, speaker_id, msg_trans_content }) => (
                    <li key={msg_id} className={cx("chatting__item", { my: speaker_id == userId })}>
                        <div className="chatting__item--user">
                            <span className="profile" />
                        </div>
                        <div className="chatting__item--text">
                            {msg_content ? (
                                <div className="text-item">
                                    <div className="text-item--audio-text typo t17 w500">{msg_content}</div>
                                    <div className="text-item--translation-text">
                                        <span className="typo t13 w500">Translation</span>
                                        <p className="typo t17 w500">{msg_trans_content}</p>
                                    </div>
                                </div>
                            ) : isRecording ? (
                                <Loading />
                            ) : (
                                <Button text="음성 인식 시작" onClick={startRecording} classname="starter" />
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Chatting
