import React, { useEffect, useMemo, useRef, useState } from "react"
import { MultiChatMessage, SingleChatMessage } from "./_component"
import { useTranslation } from "next-i18next"
import { useRecoilValue } from "recoil"
import { UserAtom } from "@atoms/Atom"
import { useQueryParams } from "@hooks/useQueryParams"
import InitChat from "./_component/messageList/multi/InitChat"
import cx from "classnames"
import { ChatProp } from "./types"

const Chatting = ({
    messages,
    chatroom,
    isRecording,
    setIsRecording,
    isLoading,
    startRecording,
    stopRecording,
    recordStatus,
    mediaRefs,
}: ChatProp) => {
    const { t } = useTranslation()
    const user = useRecoilValue(UserAtom)
    const { display } = useQueryParams()
    const refs = useRef<HTMLDivElement>(null)
    const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true)

    const messageList = useMemo(() => {
        const newMessage = {
            msg_id: "new",
            msg_content: "",
            speaker_id: user.id,
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

    const MessageContent = ({ type }: { type: string }) => (
        <li key={`my_`} className={cx("chatting__item", type)}>
            <div className="chatting__item--user">
                <span className="profile" />
            </div>
            <div className="chatting__item--text">
                <InitChat type={type} mediaRefs={mediaRefs} recordStatus={recordStatus} />
            </div>
        </li>
    )

    return (
        <div className="content__body--chat" ref={refs} onScroll={handleScroll}>
            {/* 참여자 참여 여부 */}
            {chatroom?.room_option == 2 && (
                <div className="content__body--chat--noti typo t16">
                    {chatroom?.member_id ? t("participate", { val: chatroom?.member_email }) : t("no_member")}
                </div>
            )}
            <ul>
                {messageList.map(message =>
                    display == 1 ? (
                        <MultiChatMessage
                            key={message.msg_id}
                            {...message}
                            recordStatus={recordStatus}
                            mediaRefs={mediaRefs}
                        />
                    ) : (
                        <SingleChatMessage
                            key={message.msg_id}
                            {...message}
                            data={{ isRecording, isLoading, setIsRecording, startRecording, stopRecording }}
                        />
                    )
                )}
                {display == 1 && (
                    <>
                        <MessageContent type="my" />
                        <MessageContent type="your" />
                    </>
                )}
            </ul>
        </div>
    )
}

export default Chatting
