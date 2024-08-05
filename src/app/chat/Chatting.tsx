import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { SingleChatMessage } from "./_component"
import { useTranslation } from "next-i18next"

const Chatting = ({
    messages,
    isRecording,
    isLoading,
    startRecording,
    stopRecording,
    userId,
    chatroom,
}: {
    messages: any
    isRecording: boolean
    isLoading: boolean
    startRecording: () => void
    stopRecording: () => void
    userId: string
    chatroom: ChatroomProp | null
}) => {
    const { t } = useTranslation()
    const refs = useRef<HTMLDivElement>(null)
    const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true)

    const messageList = useMemo(() => {
        const newMessage = {
            msg_id: "new",
            msg_content: "",
            speaker_id: userId,
            msg_trans_content: "",
            msg_eng_content: "",
        }

        if (chatroom?.expired_at) return [...messages]
        else return [...messages, newMessage]
    }, [messages, chatroom?.expired_at])

    useEffect(() => {
        const container = refs.current

        // 메시지 업데이트 후 자동 스크롤 로직
        if (container && isAutoScroll) {
            container.scrollTop = container.scrollHeight
        }
    }, [messages, isAutoScroll])

    const handleScroll = () => {
        const container = refs.current

        if (container) {
            const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight
            setIsAutoScroll(isAtBottom)
        }
    }

    return (
        <div className="content__body--chat" ref={refs} onScroll={handleScroll}>
            {/* 참여자 참여 여부 */}
            {chatroom?.room_option == 2 && (
                <div className="content__body--chat--noti typo t16">
                    {chatroom?.member_id ? t("participate", { val: chatroom?.member_email }) : t("no_member")}
                </div>
            )}
            <ul>
                {messageList.map(message => (
                    <SingleChatMessage
                        key={message.msg_id}
                        {...message}
                        isRecording={isRecording}
                        userId={userId}
                        startRecording={startRecording}
                        stopRecording={stopRecording}
                        isLoading={isLoading}
                    />
                ))}
            </ul>
        </div>
    )
}

export default Chatting
