import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"
import React, { useMemo } from "react"
import { ChatMessage } from "./_component"
import { useTranslation } from "next-i18next"

const Chatting = ({
    messages,
    isRecording,
    isLoading,
    startRecording,
    userId,
    chatroom,
}: {
    messages: any
    isRecording: boolean
    isLoading: boolean
    startRecording: () => void
    userId: string
    chatroom: ChatroomProp | null
}) => {
    const { t } = useTranslation()
    const messageList = useMemo(() => {
        const newMessage = { msg_id: "new", msg_content: "", speaker_id: userId, msg_trans_content: "" }

        if (chatroom?.expired_at) return [...messages]
        else return [...messages, newMessage]
    }, [messages, chatroom?.expired_at, userId])

    return (
        <div className="content__body--chat">
            {Boolean(chatroom?.approval_accepted) && (
                <div className="content__body--chat--noti typo t16">
                    {t("participate", { val: chatroom?.member_email })}
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
                        isLoading={isLoading}
                    />
                ))}
            </ul>
            {chatroom?.expired_at && <div className="content__body--chat--noti typo t16">{t("chat_finished")}</div>}
        </div>
    )
}

export default Chatting
