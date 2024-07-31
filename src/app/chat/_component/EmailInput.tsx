import { SetStateAction, useRef, useState } from "react"
import { supabase } from "@utils/superbase"
import cx from "classnames"
import "./style.scss"

const EmailInput = ({ setActiveModal }: { setActiveModal: React.Dispatch<SetStateAction<string>> }) => {
    const ref = useRef<HTMLInputElement>(null)
    const [alertMessage, setAlertMessage] = useState<string>("")

    const onSubmit = async (e: React.MouseEvent<HTMLSpanElement>) => {
        // e.stopPropagation()
        const current = ref.current

        if (current?.value) {
            //todo 암호 전송
            const { data: equalPassword } = await supabase.from("userinfo").select("*").eq("email", current.value)

            if (!equalPassword?.length) {
                setAlertMessage("This email doesn't exist.")
            } else {
                setActiveModal("resetPassword")
            }
        } else {
            setAlertMessage("Please enter the Email.")
        }
    }

    return (
        <div className="password-input">
            <div className={cx("password-input__wrapper", { reject: !!alertMessage })}>
                <input ref={ref} type="text" className="typo t18" onKeyDown={e => {}} />
                <span className="password-input--btn" onClick={e => onSubmit(e)} />
            </div>
            {alertMessage && <span className="typo t14 password-input--alert">※ {alertMessage}</span>}
        </div>
    )
}

export default EmailInput
