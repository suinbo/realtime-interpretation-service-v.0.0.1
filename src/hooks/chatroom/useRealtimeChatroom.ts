import { UserAtom } from "@atoms/Atom"
import { User } from "@supabase/supabase-js"
import { supabase } from "@utils/superbase"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"

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
const useRealtimeChatroom = (roomId: string, user: User) => {
    const [chatrooms, setChatrooms] = useState<ChatroomProp[]>([])
    //const [isApproved, setIsApproved] = useState<boolean>(false)

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
        const validUser = Object.keys(user).length === 0
        const fetchMessages = async () => {
            const { data, error } = await supabase.from("chatroom").select("*").eq("room_id", roomId)

            if (data && data.length > 0) {
                // 참여자가 있을 때
                if (data[0].member_id) {
                    console.log("참여자 있음")
                    const { data: joinData, error: joinError } = await supabase.rpc("get_chatroom_with_email", {
                        roomid: roomId,
                    })
                    console.log("joinData:: ", joinData)
                    setChatrooms(joinData || [])

                    // 참여자가 없을 때
                } else {
                    console.log("참여자 없음")
                    // 입장한 계정이 생성자 일때
                    if (user.id == data[0].creator_id) {
                        console.log("입장한 계정이 생성자")
                    }
                    // 입장한 계정이 참여자 일때
                    else {
                        console.log("입장한 계정이 참여자", user, roomId)

                        const { data: updateData } = await supabase
                            .from("chatroom")
                            .update({
                                member_id: user.id,
                            })
                            .eq("room_id", roomId)
                            .select("*")

                        if (updateData) {
                            const { data: joinData, error: joinError } = await supabase.rpc("get_chatroom_with_email", {
                                roomid: roomId,
                            })
                            setChatrooms(joinData)
                        }

                        // 암호방인지 판단
                        // if (data[0].room_password) {
                        //     setRequiresPassword(true)
                        // }
                    }
                }
            }
        }

        user && fetchMessages()

        // 컴포넌트가 언마운트될 때 구독 해제
        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, roomId])

    return {
        chatroom: chatrooms ? chatrooms[0] : null,
        //setIsApproved,
        // requiresPassword,
        // setRequiresPassword,
        // requestApproval,
        // setRequestApproval,
    }
}

export default useRealtimeChatroom
