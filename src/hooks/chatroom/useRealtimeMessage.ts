import { supabase } from "@utils/superbase"
import { useEffect, useState } from "react"

export interface MessageProp {
    msg_id: string
    msg_content: string
    msg_trans_content: string
    msg_eng_content: string
    msg_created_at: Date
    speaker_id: string
    room_id: string
}

const useRealtimeMessage = ({ roomId }: { roomId: string }) => {
    const [messages, setMessages] = useState<MessageProp[]>([]) // 채팅 메시지

    useEffect(() => {
        // 채널 생성
        const channel = supabase
            .channel("realtime:messages")
            .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, payload => {
                //console.log("Change received!", payload)
                setMessages(prevMessages => [...prevMessages, payload.new as MessageProp])
            })
            .subscribe()

        // 초기 데이터 로드
        const fetchMessages = async () => {
            const { data } = await supabase.from("messages").select("*").eq("room_id", roomId)
            setMessages(data || [])
        }

        fetchMessages()

        // 컴포넌트가 언마운트될 때 구독 해제
        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return { messages }
}

export default useRealtimeMessage
