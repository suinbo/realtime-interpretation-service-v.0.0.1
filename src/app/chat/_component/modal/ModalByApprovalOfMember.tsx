import { Button } from "@components/form"
import PasswordInput from "../PasswordInput"
import { supabase } from "@utils/superbase"
import { SimpleLayout } from "./PopupLayout"
import PendintApproval from "@components/PendingApprovalView"
import { useTranslation } from "next-i18next"
import { ModalByApprovalProp, ModalBySettingProp, PasswordInputProp } from "@app/chat/types"

const ModalByApprovalOfMember = ({
    roomId,
    setIsPassed,
    view,
    setView,
}: ModalByApprovalProp & PasswordInputProp & ModalBySettingProp) => {
    const { t } = useTranslation()

    const contentModal: { [key: string]: React.ReactNode } = {
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
                        <PasswordInput setIsPassed={setIsPassed} />
                    </div>
                }
            />
        ),
        pendingApproval: <PendintApproval />,
    }

    return contentModal[view]
}

export default ModalByApprovalOfMember
