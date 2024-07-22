"use client"

import { useState } from "react"
import { Button } from "@components/form"
import { useQueryParams } from "@hooks/useQueryParams"
import { useTranscriptions } from "@hooks/useTranscriptions"
import Loading from "./_component/Loading"
import "./style.scss"

const Chat = () => {
    const { language, display, chatting } = useQueryParams()
    const { messages, isRecording, startRecording, stopRecording } = useTranscriptions()
    const [start, setStart] = useState<boolean>(false)

    // useEffect(() => {
    //     if (!isRecording) {
    //         startRecording()
    //     }
    // }, [isRecording, startRecording])

    return (
        <div className="content">
            <div className="content__wrapper">
                {start ? (
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
                                            <Button
                                                text="음성 인식 시작"
                                                onClick={startRecording}
                                                classname="starter"
                                            />
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="content__body--button">
                        <Button
                            text="시작하기"
                            onClick={() => {
                                setStart(!start)
                                startRecording()
                            }}
                            classname="typo t38 w500"
                            theme="lined--2"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Chat
