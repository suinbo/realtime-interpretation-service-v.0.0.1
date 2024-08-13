import cx from "classnames"
import InitChat from "./InitChat"
import MultiChatMessage from "./ChatMessageOfMulti"
import { MultiInitChatProp } from "@app/chat/types"

const ChattingOfMulti = ({ messages, recordStatus, mediaRefs, langCd }: MultiInitChatProp) => {
    const MessageContent = ({ type }: { type: string }) => (
        <li key={type} className={cx("chatting__item", type)}>
            <div className="chatting__item--user">
                <span className="profile" />
            </div>
            <div className="chatting__item--text">
                <InitChat type={type} mediaRefs={mediaRefs} recordStatus={recordStatus} langCd={langCd} />
            </div>
        </li>
    )

    return (
        <ul>
            {messages?.map(message => (
                <MultiChatMessage key={message.msg_id} {...message} recordStatus={recordStatus} mediaRefs={mediaRefs} />
            ))}
            <MessageContent type="my" />
            <MessageContent type="your" />
        </ul>
    )
}

export default ChattingOfMulti
