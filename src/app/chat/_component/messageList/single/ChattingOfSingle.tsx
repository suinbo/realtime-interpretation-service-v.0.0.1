import { MessageProp } from "@hooks/chatroom/useRealtimeMessage"
import SingleChatMessage from "./ChatMessageOfSingle"

const ChattingOfSingle = ({ messages, data }: { messages: MessageProp[]; data: any }) => {
    return (
        <ul>
            {messages.map(message => (
                <SingleChatMessage key={message.msg_id} {...message} data={data} />
            ))}
        </ul>
    )
}

export default ChattingOfSingle
