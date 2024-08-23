import { Button, Input } from "@components/form"
import { SetStateAction, useMemo, useRef, useState } from "react"
import { LoginProp } from "../../setting/types"
import { supabase } from "@utils/superbase"
import { focusOnEmpty } from "@utils/common"
import { FormItem, Modal } from "@components/layout"

/** 회원 가입 모달 */
const SignupModal = ({ setActiveModal }: { setActiveModal: React.Dispatch<SetStateAction<string>> }) => {
    const [{ email, password, rePassword }, setFormItem] = useState<LoginProp>({
        email: "",
        password: "",
        rePassword: "",
    })
    const isCorrect = useMemo(() => password == rePassword, [password, rePassword])
    const [activeMiniModal, setActiveMiniModal] = useState<boolean>(false)
    const [message, setMessage] = useState<string | React.ReactNode>(
        <>
            <b>Check your password.</b>
            <span className="typo t14">※ You should enter a word of at least 6 characters.</span>
        </>
    )

    const refs = {
        email: useRef<HTMLInputElement>(null),
        password: useRef<HTMLInputElement>(null),
        rePassword: useRef<HTMLInputElement>(null),
    }

    const onSignUp = async () => {
        focusOnEmpty(refs)

        if (password && rePassword && !isCorrect) {
            setActiveMiniModal(true)
            return
        }

        if (email && password && isCorrect) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: "/",
                },
            })
            if (error) {
                setActiveMiniModal(true)
                setMessage(error.message)
            } else {
                setActiveModal("")
            }
        }

        // // 로그인 없이 채팅방 접속시
        // const previousUrl = document.referrer
        // const currentUrl = window.location.href

        // if (previousUrl.includes("/chat") && !currentUrl.includes("/chat")) {
        //     router.back()
        // }

        // const { data, error } = await supabase.auth.signInWithOAuth({
        //     provider: "kakao",
        //     provider: "google",
        //     options: {
        //         redirectTo: "https://kznbsxjbhmrmoiflpupl.supabase.co/auth/v1/callback",
        //     },
        // })
    }

    return (
        <>
            <Modal.FormLayout
                title="Sign up"
                isActive={false}
                formElement={
                    <>
                        <FormItem
                            title="Email"
                            element={
                                <Input
                                    refs={refs.email}
                                    type="text"
                                    classname="typo t15"
                                    value={email}
                                    placeholder="ex. test@gmail.com"
                                    onChange={email => setFormItem(prev => ({ ...prev, email }))}
                                />
                            }
                        />
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
                onSave={onSignUp}
                onClose={() => setActiveModal("")}
            />

            {activeMiniModal && (
                <Modal.SimpleLayout
                    isActive={activeMiniModal}
                    text={message}
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

export default SignupModal
