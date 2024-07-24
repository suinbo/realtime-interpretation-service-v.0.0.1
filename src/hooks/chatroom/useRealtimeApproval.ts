import { User } from "@supabase/supabase-js"
import { supabase } from "@utils/superbase"
import { RefObject, useEffect, useState } from "react"

interface ChatroomProp {
    id: string
    room_id: string
    creator_id: string
    member_id: string | null
    member_email?: string | null
    created_at: string
    room_password: string | null
    is_approved: number
    approval_status: number
}

/**
 *
 * @param roomId 입장한 채팅방 ID
 * @param user 로그인한 계정
 * @returns
 */
const useRealtimeApproval = (roomId: string) => {
    const [chatrooms, setChatrooms] = useState<ChatroomProp[]>([])
    const [isApproved, setIsApproved] = useState<boolean>(false)

    useEffect(() => {
        // 채널 생성
        const channel = supabase
            .channel("realtime:chatroom")
            .on("postgres_changes", { event: "*", schema: "public", table: "chatroom" }, payload => {
                setChatrooms((chatroom: ChatroomProp[]) => [...chatroom, payload.new as ChatroomProp])
            })
            .subscribe()

        // 초기 데이터 로드
        // TODO 에러 예외 처리
        const fetchMessages = async () => {
            // const { value } = ref.current as HTMLInputElement
            const { data } = await supabase.from("chatroom").select("*").eq("room_id", roomId)

            if (data?.length) {
                setChatrooms(data[0])
            }

            // if (!equalPassword?.length) {
            //     return
            // } else {
            //     await supabase
            //         .from("chatroom")
            //         .update({
            //             is_approved: 1,
            //         })
            //         .eq("room_id", roomId)

            //     setIsApproved(true)
            // }
        }

        fetchMessages()

        // 컴포넌트가 언마운트될 때 구독 해제
        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId])

    return {
        chatroom: chatrooms ? chatrooms[0] : null,
        isApproved,
    }
}

export default useRealtimeApproval
