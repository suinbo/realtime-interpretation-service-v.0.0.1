import { Button, Input } from "@components/form"
import { SetStateAction, useMemo, useRef, useState } from "react"
import { LoginProp } from "../../setting/types"
import { supabase } from "@utils/superbase"
import { focusOnEmpty } from "@utils/common"
import { FormItem, Modal } from "@components/layout"

/** 비밀번호 업데이트 모달 */
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
        focusOnEmpty(refs)

        if (password && rePassword && !isCorrect) {
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
            }
        }
    }

    return (
        <>
            <Modal.FormLayout
                title="Reset Password"
                isActive={false}
                formElement={
                    <>
                        <FormItem
                            title="Password"
                            element={
                                <Input
                                    refs={refs.password}
                                    type="password"
                                    classname="typo t15"
                                    value={password}
                                    placeholder="ex. Asdf12345*"
                                    onChange={password => setFormItem(prev => ({ ...prev, password }))}
                                />
                            }
                        />
                        <FormItem
                            title="Verify Password"
                            element={
                                <div className="form__item-wrapper">
                                    <Input
                                        refs={refs.rePassword}
                                        type="password"
                                        classname="typo t15"
                                        value={rePassword}
                                        placeholder="Please check your password."
                                        onChange={rePassword => setFormItem(prev => ({ ...prev, rePassword }))}
                                    />
                                    {password && isCorrect && <div className="re-check" />}
                                </div>
                            }
                        />
                    </>
                }
                onSave={onReset}
                onClose={() => setActiveModal("")}
            />
            {activeMiniModal && (
                <Modal.SimpleLayout
                    isActive={activeMiniModal}
                    text={
                        <>
                            <span>
                                <b>Check your password.</b>
                            </span>
                            <span className="typo t14">※ You should enter a word of at least 6 characters.</span>
                        </>
                    }
                    controller={
                        <div className="popup__content--btn">
                            <Button text="Ok" onClick={() => setActiveMiniModal(false)} classname="lined--1 typo t14" />
                        </div>
                    }
                />
            )}
        </>
    )
}

export default ResetPasswordModal
