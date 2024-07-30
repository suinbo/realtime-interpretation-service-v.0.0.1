import { User } from "@supabase/supabase-js"
import { supabase } from "@utils/superbase"
import { useCallback, useEffect, useState } from "react"

export interface ChatroomProp {
    id: string
    room_id: string
    room_title: string
    room_option: number
    chat_language: string[]
    creator_id: string
    member_id: string | null
    member_email: string | null
    created_at: Date
    expired_at: Date
    room_password: string | null
    approval_accepted: number // 승인 수락 여부 (1:수락, 0:미수락)
    approval_required: number // 승인 설정 여부 (1:활성, 0:비활성)
    approval_requested: number // 승인 요청 여부 (1:요청, 0:미요청)
}

/**
 *
 * @param roomId 입장한 채팅방 ID
 * @param user 로그인한 계정
 * @returns
 */
const useRealtimeChatroom = (roomId: string, user: User) => {
    const [chatroom, setChatroom] = useState<ChatroomProp | null>(null)

    const refetchChatroom = async () => {
        //await fetchChatrooms()
    }

    const handleDataUpdate = useCallback((payload: any) => {
        setChatroom(payload.new as ChatroomProp)
    }, [])

    useEffect(() => {
        // 채널 생성 및 구독
        const channel = supabase
            .channel("realtime:chatroom")
            .on("postgres_changes", { event: "*", schema: "public", table: "chatroom" }, handleDataUpdate)
            .subscribe()

        // 컴포넌트가 언마운트될 때 구독 해제
        return () => {
            supabase.removeChannel(channel)
        }
    }, [handleDataUpdate])

    // 초기 데이터 로드
    const fetchChatrooms = async () => {
        const { data, error } = await supabase.from("chatroom").select("*").eq("room_id", roomId)

        if (data && data.length) {
            setChatroom(data[0])
        }
    }

    // 페이지 로드 시 초기 데이터 로드
    useEffect(() => {
        fetchChatrooms()
    }, [roomId])

    const updateChatroomWithUser = async (chatroom: ChatroomProp) => {
        if (!chatroom.member_id) {
            // 로그인 계정이 생성자가 아닐 때
            if (chatroom.creator_id !== user.id) {
                const { data, error } = await supabase
                    .from("chatroom")
                    .update({
                        member_id: user.id,
                        member_email: user.email,
                    })
                    .eq("room_id", roomId)
                    .select("*")

                if (data && data.length) {
                    setChatroom(data[0])
                }
            }
        }
    }

    useEffect(() => {
        if (chatroom) {
            updateChatroomWithUser(chatroom)
        }
    }, [chatroom, user, roomId])

    return {
        chatroom,
        refetchChatroom,
    }
}

export default useRealtimeChatroom
