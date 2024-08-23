import { Button } from "@components/form"
import PasswordInput from "../PasswordInput"
import { supabase } from "@utils/superbase"
import PendintApproval from "@components/PendingApprovalView"
import { useTranslation } from "next-i18next"
import { ModalByApprovalProp, ModalBySettingProp, PasswordInputProp } from "@app/chat/types"
import { Modal } from "@components/layout"

const ModalByApprovalOfMember = ({
    roomId,
    setIsPassed,
    view,
}: ModalByApprovalProp & PasswordInputProp & ModalBySettingProp) => {
    const { t } = useTranslation()

    const contentModal: { [key: string]: React.ReactNode } = {
        approvalRequest: (
            <Modal.SimpleLayout
                hasTopIcon={true}
                text={t("required_approval")}
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
            <Modal.InputCheckLayout
                title={t("required_password")}
                isActive={true}
                formElement={<PasswordInput setIsPassed={setIsPassed} />}
            />
        ),
        pendingApproval: <PendintApproval />,
    }

    return contentModal[view]
}

export default ModalByApprovalOfMember
