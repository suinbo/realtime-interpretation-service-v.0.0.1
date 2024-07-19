"use client"

import { useQueryParams } from "@hooks/useQueryParams"
import { Stt } from "./_component/Stt"

const Chat = () => {
    const { language, display, chatting } = useQueryParams()

    return (
        <div className="content">
            <div className="content__wrapper">
                <div className="content__body--chat">
                    <ul>
                        <li className="chatting__item">
                            <div className="chatting__item--user" />
                            <div className="chatting__item--text">
                                <span>ddd</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Chat
