import { Button, Input } from "@components/form"
import Popup from "@components/Popup"
import { SetStateAction, useMemo, useRef, useState } from "react"
import { LoginProp } from "./setting/types"
import { supabase } from "@utils/superbase"
import { SimpleLayout } from "./chat/_component/modal/PopupLayout"

const ResetPasswordModal = ({ setActiveModal }: { setActiveModal: React.Dispatch<SetStateAction<string>> }) => {
    const [{ password, rePassword }, setFormItem] = useState<LoginProp>({
        password: "",
        rePassword: "",
    })
    const isCorrect = useMemo(() => password == rePassword, [password, rePassword])
    const [activeMiniModal, setActiveMiniModal] = useState<boolean>(false)

    const refs = {
        password: useRef<HTMLInputElement>(null),
        rePassword: useRef<HTMLInputElement>(null),
    }

    const onReset = async () => {
        const focusOnEmpty = (field: "password" | "rePassword") => {
            const ref = refs[field]
            ref.current?.focus()
        }

        if (!password) focusOnEmpty("password")
        if (!rePassword) focusOnEmpty("rePassword")

        if (password && !isCorrect) {
            setActiveMiniModal(true)
            return
        }

        if (isCorrect) {
            const { data, error } = await supabase.auth.updateUser({
                password,
            })
            if (error) {
                console.error(error.message)
            } else {
                setActiveModal("")
                console.log("data:: ", data)
            }
        }
    }

    return (
        <>
            <Popup
                title="Reset Password"
                onClose={() => setActiveModal("")}
                style={{ width: 800 }}
                popupId="signup-form">
                <div className="popup__content">
                    <div className="popup__content--form">
                        <div className="form__item">
                            <p className="form__item-label typo t17 w500">Password</p>
                            <div>
                                <Input
                                    refs={refs.password}
                                    type="password"
                                    classname="typo t17"
                                    value={password}
                                    placeholder="ex. Asdf12345*"
                                    onChange={password => setFormItem(prev => ({ ...prev, password }))}
                                />
                            </div>
                        </div>
                        <div className="form__item">
                            <p className="form__item-label typo t17 w500">Verify Password</p>
                            <div className="form__item-wrapper">
                                <Input
                                    refs={refs.rePassword}
                                    type="password"
                                    classname="typo t17"
                                    value={rePassword}
                                    placeholder="Please check your password."
                                    onChange={rePassword => setFormItem(prev => ({ ...prev, rePassword }))}
                                />
                                {password && isCorrect && <div className="re-check" />}
                            </div>
                        </div>
                    </div>
                    <div className="popup__content--btn--login">
                        <Button text="Submit" onClick={onReset} classname="lined--1 typo t16 w500" />
                        <Button text="Cancel" onClick={() => setActiveModal("")} classname="secondary typo t16 w500" />
                    </div>
                </div>
            </Popup>
            {activeMiniModal && (
                <SimpleLayout
                    text={
                        <>
                            <p className="typo t18 w500">Check your password.</p>
                            <span className="typo t15">
                                ※ You should enter a word of at least 8 characters by combining at least 3 types of
                                letters, numbers, and special characters.
                            </span>
                        </>
                    }
                    controller={
                        <div className="popup__content--btn">
                            <Button
                                text="Ok"
                                onClick={() => setActiveMiniModal(false)}
                                classname="lined--1 typo t15 w500"
                            />
                        </div>
                    }
                />
            )}
        </>
    )
}

export default ResetPasswordModal
