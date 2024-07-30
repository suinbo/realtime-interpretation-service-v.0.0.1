import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"
import React, { useMemo } from "react"
import { ChatMessage } from "./_component"

const Chatting = ({
    messages,
    isRecording,
    startRecording,
    userId,
    chatroom,
}: {
    messages: any
    isRecording: boolean
    startRecording: () => void
    userId: string
    chatroom: ChatroomProp | null
}) => {
    const messageList = useMemo(() => {
        const newMessage = { msg_id: "new", msg_content: "", speaker_id: userId, msg_trans_content: "" }

        if (chatroom?.expired_at) return [...messages]
        else return [...messages, newMessage]
    }, [messages, chatroom?.expired_at, userId])

    return (
        <div className="content__body--chat">
            {Boolean(chatroom?.approval_accepted) && (
                <div className="content__body--chat--noti typo t16">
                    {`${chatroom?.member_email} 님이 참여하였습니다.`}
                </div>
            )}
            <ul>
                {messageList.map(message => (
                    <ChatMessage
                        key={message.msg_id}
                        {...message}
                        isRecording={isRecording}
                        userId={userId}
                        startRecording={startRecording}
                    />
                ))}
            </ul>
            {chatroom?.expired_at && <div className="content__body--chat--noti typo t16">대화가 종료되었습니다.</div>}
        </div>
    )
}

export default Chatting
