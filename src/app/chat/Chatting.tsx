import { Button } from "@components/form"
import Loading from "./_component/LoadingDot"

const Chatting = ({
    messages,
    isRecording,
    startRecording,
}: {
    messages: any
    isRecording: boolean
    startRecording: () => void
}) => {
    return (
        <div className="content__body--chat">
            <ul>
                {[...messages, { id: "", content: "" }].map(({ id, content }, index) => (
                    <li key={id} className="chatting__item">
                        <div className="chatting__item--user">
                            <span className="profile" />
                        </div>
                        <div className="chatting__item--text">
                            {content ? (
                                <span className="typo t22">{content}</span>
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
