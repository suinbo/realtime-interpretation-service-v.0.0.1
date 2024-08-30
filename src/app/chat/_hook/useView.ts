import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"
import { useQueryParams } from "@hooks/useQueryParams"
import { parsedCookie } from "@utils/common"
import { useEffect, useState } from "react"

/** 모달 상태 관리 훅 */
export const useView = (chatroom?: ChatroomProp | null, userId?: string) => {
    const { id } = useQueryParams()
    const [view, setView] = useState<string>("")

    // 쿠키 (is_passed)
    const getCookiePassedStatus = parsedCookie(id as string) ? parsedCookie(id as string).is_passed : ""

    // 암호 코드 입력
    const [isPassed, setIsPassed] = useState<string>(getCookiePassedStatus as string)

    useEffect(() => {
        if (chatroom) {
            const {
                creator_id,
                member_id,
                room_option,
                room_password,
                approval_accepted,
                approval_required,
                approval_requested,
                expired_at,
            } = chatroom

            const isAccepted = Boolean(approval_accepted)
            const isRequired = Boolean(approval_required)
            const isRequested = Boolean(approval_requested)

            /* 암호 코드 요청 (참여자) - 계정이 참여자 and 암호 활성화 and 암호 입력 전 */
            const isRequestPassword = userId === member_id && !!room_password && !isPassed

            /* 승인 요청 (참여자) - 계정이 참여자 and 승인 활성화 and 미승인 */
            const isRequestApproval = userId === member_id && isRequired && !isRequested && !isAccepted

            /* 승인 수락 요청 대기 (참여자) - 계정이 참여자 and 승인 요청 and 미승인 */
            const isPendingApproval = userId === member_id && isRequired && isRequested && !isAccepted

            /* 승인 수락 요청 (생성자) - 계정이 생성자 and 승인 활성화 and 미승인 */
            const isApprovalResponse = userId === creator_id && isRequired && !isAccepted && isRequested

            /* 채팅방 만료 */
            const isExpired = !!expired_at || (userId !== creator_id && room_option == 1)

            /** 채팅방 디스플레이 옵션 2 */
            const isSingleDisplay = room_option == 2

            if (isSingleDisplay && isRequestPassword) setView("passwordRequest")
            else if (isSingleDisplay && isRequestApproval) setView("approvalRequest")
            else if (isSingleDisplay && isPendingApproval) setView("pendingApproval")
            else if (isSingleDisplay && isApprovalResponse) setView("approvalResponse")
            else setView("")

            if (isExpired) setView("invalidRoom")

            setIsPassed(getCookiePassedStatus as string)
        }
    }, [chatroom, isPassed])

    return { view, setView, setIsPassed }
}
