import { useRef, useState } from "react"
import { supabase } from "@utils/superbase"
import { useTranslation } from "next-i18next"
import cookie from "@utils/cookie"
import { FLAG } from "@resources/constant"
import cx from "classnames"
import { PasswordInputProp } from "../types"
import { useQueryParams } from "@hooks/useQueryParams"
import { parsedCookie } from "@utils/common"
import "./style.scss"

const PasswordInput = ({ setIsPassed }: PasswordInputProp) => {
    const { t } = useTranslation()
    const { id } = useQueryParams()

    const ref = useRef<HTMLInputElement>(null)
    const [alertMessage, setAlertMessage] = useState<string>("")

    const onSubmit = async (e: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>) => {
        e.preventDefault() //form 기본 동작(제출) 방지
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
                // 암호 일치 여부 쿠키에 저장
                cookie.setItem({
                    key: id as string,
                    value: JSON.stringify({
                        is_passed: FLAG.Y,
                        languageSet: parsedCookie(id as string) ? parsedCookie(id as string).languageSet : "",
                    }),
                })

                setIsPassed(FLAG.Y)
            }
        } else {
            setAlertMessage(t("enter_password"))
        }
    }

    return (
        <div className="password-input">
            <div className={cx("password-input__wrapper", { reject: !!alertMessage })}>
                <form>
                    <input
                        ref={ref}
                        type="password"
                        className="typo t18"
                        onKeyDown={(e: React.KeyboardEvent<HTMLSpanElement>) => {
                            e.key == "Enter" && onSubmit(e)
                        }}
                        autoComplete="off"
                    />
                </form>

                <span className="password-input--btn" onClick={e => onSubmit(e)} />
            </div>
            {alertMessage && <span className="typo t14 password-input--alert">※ {alertMessage}</span>}
        </div>
    )
}

export default PasswordInput
