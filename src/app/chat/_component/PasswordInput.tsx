import { useRef, useState } from "react"
import { supabase } from "@utils/superbase"
import cx from "classnames"
import "./style.scss"
import { useTranslation } from "next-i18next"

const PasswordInput = ({ roomId }: { roomId: string }) => {
    const { t } = useTranslation()
    const ref = useRef<HTMLInputElement>(null)
    const [alertMessage, setAlertMessage] = useState<string>("")

    const onSubmit = async (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation()
        const current = ref.current

        if (current?.value) {
            //todo 암호 전송
            const { data: equalPassword } = await supabase
                .from("chatroom")
                .select("*")
                .eq("room_password", current.value)
            if (!equalPassword?.length) {
                setAlertMessage(t("invalid_password"))
            } else {
                // 자동 승인
                const { data } = await supabase
                    .from("chatroom")
                    .update({
                        approval_accepted: 1,
                    })
                    .eq("room_id", roomId)
                    .select("*")
            }
        } else {
            setAlertMessage(t("enter_password"))
        }
    }

    return (
        <div className="password-input">
            <div className={cx("password-input__wrapper", { reject: !!alertMessage })}>
                <input ref={ref} type="password" className="typo t18" onKeyDown={e => {}} />
                <span className="password-input--btn" onClick={e => onSubmit(e)} />
            </div>
            {alertMessage && <span className="typo t14 password-input--alert">※ {alertMessage}</span>}
        </div>
    )
}

export default PasswordInput
