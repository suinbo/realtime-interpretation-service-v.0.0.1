import { Button } from "@components/form"
import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"
import { supabase } from "@utils/superbase"
import { SimpleLayout } from "./PopupLayout"
import { useRouter } from "next/navigation"
import { useTranslation } from "next-i18next"

const ModalByApprovalOfHost = ({
    chatroom,
    roomId,
    viewOption: { showResponseApproval },
}: {
    chatroom: ChatroomProp
    roomId: string
    viewOption: { [key: string]: boolean }
}) => {
    const router = useRouter()
    const { t } = useTranslation()

    const contentModal = {
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

    if (showResponseApproval) return contentModal["approvalResponse"]

    return null
}

export default ModalByApprovalOfHost
