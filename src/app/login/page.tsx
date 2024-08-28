"use client"

import { useRouter } from "next/navigation"
import { Button, Input } from "@components/form"
import { supabase } from "@utils/superbase"
import { useRef, useState } from "react"
import { useSetRecoilState } from "recoil"
import { UserAtom } from "@atoms/Atom"
import { focusOnEmpty } from "@utils/common"
import SignupModal from "./modal/SignupModal"
import ResetPasswordModal from "./modal/ResetPasswordModal"
import { LoginProp, UserProp } from "@app/setting/types"
import { Modal } from "@components/layout"
import EmailInput from "@app/chat/_component/EmailInput"
import "@assets/styles/common.scss"
import "./style.scss"

/**
 * 로그인 화면
 */
const Login = () => {
    const router = useRouter()
    const setUser = useSetRecoilState<UserProp>(UserAtom)
    const [{ email, password }, setInput] = useState<LoginProp>({ email: "", password: "" })
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [activeModal, setActiveModal] = useState<string>("")

    const refs = {
        email: useRef<HTMLInputElement>(null),
        password: useRef<HTMLInputElement>(null),
    }

    const onSignIn = async (e?: React.KeyboardEvent<HTMLInputElement>) => {
        e?.preventDefault() //form 기본 동작(제출) 방지
        focusOnEmpty(refs)

        if (email && password) {
            const { data: user, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setErrorMessage(error.message)
            } else {
                setUser(prev => ({ ...prev, user }))

                // userinfo 테이블에 로그인 여부 컬럼 저장
                await supabase
                    .from("userinfo")
                    .update({
                        is_logged: 1,
                    })
                    .eq("email", email)
                    .select("*")

                if (!!localStorage.getItem("redirectTo")) {
                    const redirectTo = localStorage.getItem("redirectTo") || "/"
                    localStorage.removeItem("redirectTo")
                    router.push(redirectTo)
                } else router.push("/setting")
            }
        }
    }

    const contentModal: { [key: string]: React.ReactNode } = {
        signup: <SignupModal setActiveModal={setActiveModal} />,
        resetPassword: <ResetPasswordModal setActiveModal={setActiveModal} />,
        emailInput: (
            <Modal.InputCheckLayout
                title="Please enter the Email"
                isActive={activeModal == "emailInput"}
                formElement={<EmailInput setActiveModal={setActiveModal} />}
                onClose={() => setActiveModal("")}
            />
        ),
    }

    return (
        <>
            <div className="login__form">
                <form className="login__form__item--input">
                    <Input
                        refs={refs.email}
                        classname="typo t17"
                        placeholder="Email"
                        value={email}
                        onChange={email => setInput(prev => ({ ...prev, email }))}
                    />
                    <Input
                        refs={refs.password}
                        classname="typo t17"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={password => setInput(prev => ({ ...prev, password }))}
                        onKeyDown={e => e.key == "Enter" && onSignIn(e)}
                    />
                    {errorMessage && <span className="alert">※ {errorMessage}</span>}
                </form>
                <div className="login__form__item--btn">
                    <Button classname="typo t20" text="Sign In" onClick={onSignIn} />
                    <Button classname="typo t18 signup" text="Sign Up" onClick={() => setActiveModal("signup")} />
                </div>
                <div className="login__form__item--reset typo t17">
                    <span className="typo t15" onClick={() => setActiveModal("emailInput")}>
                        Forgot Password ?
                    </span>
                </div>
            </div>
            {contentModal[activeModal]}
        </>
    )
}

export default Login
