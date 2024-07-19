"use client"

import { Button } from "@components/form"
import { useQueryParams } from "@hooks/useQueryParams"
import { useTranscriptions } from "@hooks/useTranscriptions"
import "./style.scss"

const Chat = () => {
    const { language, display, chatting } = useQueryParams()
    const { messages, isRecording, startRecording, stopRecording } = useTranscriptions()

    // TODO 대화 ID 들고오기 (현재 가장 마지막 content 들고옴)
    // useEffect(() => {
    //     if (!isRecording) {
    //         startRecording()
    //     }
    // }, [isRecording, startRecording])

    return (
        <div className="content">
            <div className="content__wrapper">
                <div className="content__body--chat">
                    <ul>
                        <li className="chatting__item">
                            <div className="chatting__item--user" />
                            <div className="chatting__item--text">
                                <Button
                                    text={isRecording ? "음성 인식중" : "음성 인식 시작"}
                                    onClick={startRecording}
                                    classname="starter"
                                />
                                <span>{messages[messages.length - 1]?.content}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Chat
