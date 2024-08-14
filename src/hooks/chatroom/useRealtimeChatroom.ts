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
    is_started: number //대화 시작 여부
}

/**
 * 실시간 채팅방 구독 및 데이터 관리
 * @param roomId 입장한 채팅방 ID
 * @param user 로그인한 계정
 * @returns { chatroom } 현재 채팅방 데이터
 */
const useRealtimeChatroom = (roomId: string, user?: User) => {
    const [chatroom, setChatroom] = useState<ChatroomProp | null>(null)
    const [isInvalidRoom, setIsInvalidRoom] = useState<boolean>(false)

    /**
     * 주어진 roomId에 대한 채팅방 데이터를 가져오는 함수
     * @param roomId 채팅방 ID
     * @returns 채팅방 데이터 또는 null
     */
    const fetchChatroomData = async (roomId: string) => {
        try {
            const { data, error } = await supabase.from("chatroom").select("*").eq("room_id", roomId)
            if (error) {
                setIsInvalidRoom(true)
                return
            }
            return data.length ? data[0] : null
        } catch (error) {
            console.error("Unexpected error:", error)
            return null
        }
    }

    const handleDataUpdate = useCallback(async () => {
        const data = await fetchChatroomData(roomId)
        if (data) setChatroom(data)
    }, [roomId])

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

    // 페이지 로드 시 초기 데이터 로드
    useEffect(() => {
        fetchChatroomData(roomId).then(setChatroom)
    }, [roomId])

    const updateChatroomWithUser = async (chatroom: ChatroomProp) => {
        if (user && !chatroom.member_id) {
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
    }, [chatroom, updateChatroomWithUser])

    return {
        chatroom,
        isInvalidRoom,
    }
}

export default useRealtimeChatroom
