import { Button } from "@components/form"
import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"
import PasswordInput from "./PasswordInput"
import PendintApproval from "./PendingApprovalView"
import { supabase } from "@utils/superbase"
import { SimpleLayout } from "./PopupLayout"

const Modal = ({
    chatroom,
    roomId,
    viewOption: { showRequestPassword, showRequestApproval, showResponseApproval, showPendingApproval },
}: {
    chatroom: ChatroomProp
    roomId: string
    viewOption: { [key: string]: boolean }
}) => {
    // 팝업 레이아웃
    const contentModal = {
        approvalRequest: (
            <SimpleLayout
                text={
                    <>
                        대화 참여를 위해<span className="typo w500"> 호스트 승인</span>이 필요합니다.
                    </>
                }
                controller={
                    <div className="popup__content--btn">
                        <Button
                            text="승인 요청"
                            onClick={async () => {
                                const { data } = await supabase
                                    .from("chatroom")
                                    .update({
                                        approval_requested: 1,
                                    })
                                    .eq("room_id", roomId)
                                    .select("*")
                            }}
                            classname="lined--1 typo t17 w500"
                        />
                    </div>
                }
            />
        ),
        approvalResponse: (
            <SimpleLayout
                text={
                    <>
                        <span className="typo w500">{chatroom?.member_email}</span> 님이 승인을 요청 합니다.
                    </>
                }
                controller={
                    <div className="popup__content--btn">
                        <Button
                            text="수락"
                            onClick={async () => {
                                const { data } = await supabase
                                    .from("chatroom")
                                    .update({
                                        approval_accepted: 1,
                                    })
                                    .eq("room_id", roomId)
                                    .select("*")
                            }}
                            classname="lined--1 typo t17 w500"
                        />
                        <Button text="거절" onClick={() => ({})} classname="secondary typo t17 w500 " />
                    </div>
                }
            />
        ),
        passwordRequest: (
            <SimpleLayout
                text={
                    <>
                        대화 참여를 위해<span className="typo w600"> 암호 코드</span>를 입력하세요.
                    </>
                }
                controller={
                    <div className="popup__content--input">
                        <PasswordInput roomId={roomId as string} />
                    </div>
                }
            />
        ),
        pendingApproval: <PendintApproval />,
    }

    if (showRequestPassword) return contentModal["passwordRequest"]
    if (showRequestApproval) return contentModal["approvalRequest"]
    if (showResponseApproval) return contentModal["approvalResponse"]
    if (showPendingApproval) return contentModal["pendingApproval"]

    return null
}

export default Modal
