import { useRef, useState } from "react"
import cx from "classnames"
import "./style.scss"
import { supabase } from "@utils/superbase"

const PasswordInput = ({ roomId, refetchChatroom }: { roomId: string; refetchChatroom: () => {} }) => {
    const ref = useRef<HTMLInputElement>(null)
    const [alertMessage, setAlertMessage] = useState<string>("")

    const onSubmit = async () => {
        const current = ref.current

        if (current?.value) {
            //todo 암호 전송
            const { data: equalPassword } = await supabase
                .from("chatroom")
                .select("*")
                .eq("room_password", current.value)

            if (!equalPassword?.length) {
                setAlertMessage("암호 코드가 일치하지 않습니다.")
            } else {
                // 자동 승인
                await supabase
                    .from("chatroom")
                    .update({
                        is_approved: 1,
                    })
                    .eq("room_id", roomId)

                refetchChatroom()
            }
        } else {
            setAlertMessage("암호 코드를 입력해주세요.")
        }
    }

    return (
        <div className="password-input">
            <div className={cx("password-input__wrapper", { reject: !!alertMessage })}>
                <input ref={ref} type="password" className="typo t18" onKeyDown={e => {}} />
                <span className="password-input--btn" onClick={onSubmit} />
            </div>
            {alertMessage && <span className="typo t16 password-input--alert">※ {alertMessage}</span>}
        </div>
    )
}

export default PasswordInput
