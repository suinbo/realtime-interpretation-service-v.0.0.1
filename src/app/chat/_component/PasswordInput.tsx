import { SetStateAction, useRef, useState } from "react"
import cx from "classnames"
import "./style.scss"
import { supabase } from "@utils/superbase"
import useRealtimeChatroom from "@hooks/chatroom/useRealtimeChatroom"
import useRealtimeApproval from "@hooks/chatroom/useRealtimeApproval"

const PasswordInput = ({
    roomId,
}: // onSubmit,
//onKeyDown,
//setIsApproved,
{
    roomId: string
    //type?: string
    // onSubmit?: () => void
    //onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    //setIsApproved: React.Dispatch<SetStateAction<boolean>>
}) => {
    const ref = useRef<HTMLInputElement>(null)
    const [alertMessage, setAlertMessage] = useState<string>("")
    // const { chatroom } = useRealtimeChatroom(roomId, {} as any)

    // console.log("chatroom:: ", chatroom)

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
                await supabase
                    .from("chatroom")
                    .update({
                        is_approved: 1,
                    })
                    .eq("room_id", roomId)
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
