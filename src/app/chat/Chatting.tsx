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
    return (
        <div className="content__body--chat">
            <ul>
                {[...messages, { msg_id: "new", msg_content: "", speaker_id: userId }].map(
                    ({ msg_id, msg_content, speaker_id }) => (
                        <li key={msg_id} className={cx("chatting__item", { my: speaker_id == userId })}>
                            <div className="chatting__item--user">
                                <span className="profile" />
                            </div>
                            <div className="chatting__item--text">
                                {msg_content ? (
                                    <span className="typo t22">{msg_content}</span>
                                ) : isRecording ? (
                                    <Loading />
                                ) : (
                                    <Button text="음성 인식 시작" onClick={startRecording} classname="starter" />
                                )}
                            </div>
                        </li>
                    )
                )}
            </ul>
        </div>
    )
}

export default Chatting
