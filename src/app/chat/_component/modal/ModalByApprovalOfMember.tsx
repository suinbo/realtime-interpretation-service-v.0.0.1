import { Button } from "@components/form"
import PasswordInput from "../PasswordInput"
import { supabase } from "@utils/superbase"
import { SimpleLayout } from "./PopupLayout"
import PendintApproval from "@components/PendingApprovalView"
import { useRouter } from "next/navigation"
import { useTranslation } from "next-i18next"
import { SetStateAction } from "react"
import cookie from "@utils/cookie"

const Modal = ({
    roomId,
    viewOption: { showRequestPassword, showRequestApproval, showPendingApproval },
    setIsPassed,
}: {
    roomId: string
    viewOption: { [key: string]: boolean }
    setIsPassed: React.Dispatch<SetStateAction<string>>
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
        invalidRoom: (
            <SimpleLayout
                isActive={true}
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
                            onClick={() => {
                                cookie.clear()
                                router.push("/setting")
                            }}
                            classname="secondary typo t17 w500"
                        />
                    </div>
                }
            />
        ),
    }

    if (showRequestPassword) return contentModal["passwordRequest"]
    if (showRequestApproval) return contentModal["approvalRequest"]
    if (showPendingApproval) return contentModal["pendingApproval"]

    return null
}

export default Modal
