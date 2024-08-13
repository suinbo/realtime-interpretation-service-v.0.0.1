import React, { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "next-i18next"
import { useRecoilValue } from "recoil"
import { UserAtom } from "@atoms/Atom"
import { ChatProp } from "./types"
import ChattingOfMulti from "./_component/messageList/multi/ChattingOfMulti"
import ChattingOfSingle from "./_component/messageList/single/ChattingOfSingle"
import { MessageProp } from "@hooks/chatroom/useRealtimeMessage"

const Chatting = ({ messages, chatroom, langCd, data, recordStatus, mediaRefs }: ChatProp) => {
    const { t } = useTranslation()
    const user = useRecoilValue(UserAtom)
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

    return (
        <div className="content__body--chat" ref={refs} onScroll={handleScroll}>
            {/* 참여자 참여 여부 */}
            {chatroom?.room_option == 2 && (
                <div className="content__body--chat--noti typo t16">
                    {chatroom?.member_id ? t("participate", { val: chatroom?.member_email }) : t("no_member")}
                </div>
            )}
            {chatroom?.room_option == 1 ? (
                <ChattingOfMulti
                    messages={messageList as MessageProp[]}
                    recordStatus={recordStatus}
                    mediaRefs={mediaRefs}
                    langCd={langCd}
                />
            ) : (
                <ChattingOfSingle messages={messageList as MessageProp[]} data={data} />
            )}
        </div>
    )
}

export default Chatting
