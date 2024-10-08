import { Button } from "@components/form"
import { supabase } from "@utils/superbase"
import { useRouter } from "next/navigation"
import { useTranslation } from "next-i18next"
import { ModalByApprovalProp, ModalBySettingProp } from "@app/chat/types"
import cookie from "@utils/cookie"
import { Modal } from "@components/layout"

const ModalByApprovalOfHost = ({ chatroom, roomId, view, setView }: ModalByApprovalProp & ModalBySettingProp) => {
    const router = useRouter()
    const { t } = useTranslation()

    const contentModal: { [key: string]: React.ReactNode } = {
        approvalResponse: (
            <Modal.SimpleLayout
                isActive={view == "approvalResponse"}
                hasTopIcon={true}
                text={t("user_requests", { val: chatroom?.member_email })}
                controller={
                    <div className="popup__content--btn">
                        <Button
                            text={t("accept")}
                            onClick={async () => {
                                await supabase
                                    .from("chatroom")
                                    .update({
                                        approval_accepted: 1,
                                    })
                                    .eq("room_id", roomId)
                                    .select("*")
                                setView("")
                            }}
                            classname="lined--1 typo t17 w500"
                        />
                        <Button
                            text={t("refuse")}
                            onClick={async () => {
                                await supabase
                                    .from("chatroom")
                                    .update({
                                        approval_requested: 0,
                                    })
                                    .eq("room_id", roomId)
                                    .select("*")
                                setView("")
                            }}
                            classname="secondary typo t17 w500 "
                        />
                    </div>
                }
            />
        ),
        invalidRoom: (
            <Modal.SimpleLayout
                isActive={true}
                text={t("invalid_url")}
                controller={
                    <div className="popup__content--btn">
                        <Button
                            text={t("go_home")}
                            onClick={() => {
                                cookie.clear()
                                router.push("/setting")
                            }}
                            classname="secondary typo t15 w500"
                        />
                    </div>
                }
            />
        ),
    }

    return contentModal[view]
}

export default ModalByApprovalOfHost
