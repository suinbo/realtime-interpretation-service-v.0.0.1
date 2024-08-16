import { Button, Input } from "@components/form"
import Popup from "@components/Popup"
import { SetStateAction, useEffect, useMemo, useRef, useState } from "react"
import { LoginProp } from "../../setting/types"
import { supabase } from "@utils/superbase"
import { SimpleLayout } from "../../chat/_component/modal/PopupLayout"
import { focusOnEmpty } from "@utils/common"

/** 회원 가입 모달 */
const SignupModal = ({ setActiveModal }: { setActiveModal: React.Dispatch<SetStateAction<string>> }) => {
    const [{ email, password, rePassword }, setFormItem] = useState<LoginProp>({
        email: "",
        password: "",
        rePassword: "",
    })
    const isCorrect = useMemo(() => password == rePassword, [password, rePassword])
    const [activeMiniModal, setActiveMiniModal] = useState<boolean>(false)

    //비밀번호 규칙 :영문, 숫자, 특수문자 중 3종류 이상을 조합하여 최소 8자리 이상

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
                console.error(error.message)
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
            <Popup title="Sign-up Form" onClose={() => setActiveModal("")} style={{ width: 800 }}>
                <div className="popup__content">
                    <div className="popup__content--form">
                        <div className="form__item">
                            <p className="form__item-label typo t16 w500">Email</p>
                            <Input
                                refs={refs.email}
                                type="text"
                                classname="typo t15"
                                value={email}
                                placeholder="ex. test@gmail.com"
                                onChange={email => setFormItem(prev => ({ ...prev, email }))}
                            />
                        </div>
                        <div className="form__item">
                            <p className="form__item-label typo t16 w500">Password</p>
                            <div>
                                <Input
                                    refs={refs.password}
                                    type="password"
                                    classname="typo t15"
                                    value={password}
                                    placeholder="ex. Asdf12345*"
                                    onChange={password => setFormItem(prev => ({ ...prev, password }))}
                                />
                            </div>
                        </div>
                        <div className="form__item">
                            <p className="form__item-label typo t16 w500">Verify Password</p>
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
                        </div>
                    </div>
                    <div className="popup__content--btn--login">
                        <Button text="Submit" onClick={onSignUp} classname="lined--1 typo t14" />
                        <Button text="Cancel" onClick={() => setActiveModal("")} classname="secondary typo t14" />
                    </div>
                </div>
            </Popup>
            {activeMiniModal && (
                <SimpleLayout
                    isActive={activeMiniModal}
                    text={
                        <>
                            <b>Check your password.</b>
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

export default SignupModal
