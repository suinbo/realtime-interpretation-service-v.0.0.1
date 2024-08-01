import { Button } from "@components/form"
import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"
import PasswordInput from "../PasswordInput"
import { supabase } from "@utils/superbase"
import { SimpleLayout } from "./PopupLayout"
import PendintApproval from "@components/PendingApprovalView"
import { useRouter } from "next/navigation"
import { useTranslation } from "next-i18next"

const Modal = ({
    chatroom,
    roomId,
    viewOption: {
        showRequestPassword,
        showRequestApproval,
        showResponseApproval,
        showPendingApproval,
        showInvalidRoom,
    },
}: {
    chatroom: ChatroomProp
    roomId: string
    viewOption: { [key: string]: boolean }
}) => {
    const router = useRouter()
    const { t } = useTranslation()

    const contentModal = {
        approvalRequest: (
            <SimpleLayout
                hasTopIcon={true}
                text={
                    <>
                        {/* 대화 참여를 위해<span className="typo w500"> 호스트 승인</span>이 필요합니다. */}
                        {t("required_approval")}
                    </>
                }
                controller={
                    <div className="popup__content--btn">
                        <Button
                            text={t("request_approval")}
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
                hasTopIcon={true}
                text={
                    <>
                        {/* <span className="typo w500">{chatroom?.member_email}</span> 님이 승인을 요청 합니다. */}
                        {t("user_requests", { val: chatroom?.member_email })}
                    </>
                }
                controller={
                    <div className="popup__content--btn">
                        <Button
                            text={t("accept")}
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
                        <Button text={t("refuse")} onClick={() => ({})} classname="secondary typo t17 w500 " />
                    </div>
                }
            />
        ),
        passwordRequest: (
            <SimpleLayout
                isActive={true}
                text={
                    <>
                        {/* 대화 참여를 위해 <span className="typo w600"> 암호 코드</span>를 입력하세요. */}
                        {t("required_password")}
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
        invalidRoom: (
            <SimpleLayout
                text={
                    <>
                        {/* <span className="typo w500">유효하지 않은</span> 링크 입니다. */}
                        {t("invalid_url")}
                    </>
                }
                controller={
                    <div className="popup__content--btn">
                        <Button
                            text={t("go_home")}
                            onClick={() => router.push("/")}
                            classname="secondary typo t17 w500"
                        />
                    </div>
                }
            />
        ),
    }

    if (showRequestPassword) return contentModal["passwordRequest"]
    if (showRequestApproval) return contentModal["approvalRequest"]
    if (showResponseApproval) return contentModal["approvalResponse"]
    if (showPendingApproval) return contentModal["pendingApproval"]
    if (showInvalidRoom) return contentModal["invalidRoom"]

    return null
}

export default Modal
