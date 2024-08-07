import { SetStateAction, useRef, useState } from "react"
import { supabase } from "@utils/superbase"
import { useTranslation } from "next-i18next"
import cookie from "@utils/cookie"
import { FLAG } from "@resources/constant"
import cx from "classnames"
import "./style.scss"
import { PasswordInputProp } from "../types"

const PasswordInput = ({ setIsPassed }: PasswordInputProp) => {
    const { t } = useTranslation()
    const ref = useRef<HTMLInputElement>(null)
    const [alertMessage, setAlertMessage] = useState<string>("")

    const onSubmit = async (e: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>) => {
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
                // 암호 일치시 쿠키에 저장
                cookie.setItem({ key: "is_passed", value: FLAG.Y })
                setIsPassed(FLAG.Y)

                // 자동 승인
                // const { data } = await supabase
                //     .from("chatroom")
                //     .update({
                //         approval_accepted: 1,
                //     })
                //     .eq("room_id", roomId)
                //     .select("*")
            }
        } else {
            setAlertMessage(t("enter_password"))
        }
    }

    return (
        <div className="password-input">
            <div className={cx("password-input__wrapper", { reject: !!alertMessage })}>
                <input
                    ref={ref}
                    type="password"
                    className="typo t18"
                    onKeyDown={(e: React.KeyboardEvent<HTMLSpanElement>) => e.key == "Enter" && onSubmit(e)}
                />
                <span className="password-input--btn" onClick={e => onSubmit(e)} />
            </div>
            {alertMessage && <span className="typo t14 password-input--alert">※ {alertMessage}</span>}
        </div>
    )
}

export default PasswordInput
