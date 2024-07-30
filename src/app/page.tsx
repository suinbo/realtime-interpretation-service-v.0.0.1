"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button, Input } from "@components/form"
import { supabase } from "@utils/superbase"
import { useRef, useState } from "react"
import { useSetRecoilState } from "recoil"
import { LoginProp } from "./setting/types"
import { UserAtom } from "@atoms/Atom"
import { User } from "@supabase/supabase-js"
import "@assets/styles/common.scss"
import "./style.scss"
import SignupModal from "./SignupModal"
import ResetPasswordModal from "./ResetPasswordModal"
import { SimpleLayout } from "./chat/_component/modal/PopupLayout"
import { EmailInput } from "./chat/_component"

/**
 * 로그인 화면
 */
const Login = () => {
    const router = useRouter()
    const setUser = useSetRecoilState<User>(UserAtom)
    const [{ email, password }, setInput] = useState<LoginProp>({ email: "", password: "" })
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [activeModal, setActiveModal] = useState<string>("")

    const refs = {
        email: useRef<HTMLInputElement>(null),
        password: useRef<HTMLInputElement>(null),
    }

    const onSignIn = async () => {
        const focusOnEmpty = (field: "email" | "password") => {
            const ref = refs[field]
            ref.current?.focus()
        }

        if (!email) focusOnEmpty("email")

        if (!password) focusOnEmpty("password")

        if (email && password) {
            const { data: user, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setErrorMessage(error.message)
            } else {
                setUser(prev => ({ ...prev, user }))
                router.push("/setting")
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

    const contentModal: { [key: string]: React.ReactNode } = {
        signup: <SignupModal setActiveModal={setActiveModal} />,
        resetPassword: <ResetPasswordModal setActiveModal={setActiveModal} />,
        emailInput: (
            <SimpleLayout
                text={
                    <>
                        Please enter the <span className="typo w600">Email</span>.
                    </>
                }
                controller={
                    <div className="popup__content--input">
                        <EmailInput setActiveModal={setActiveModal} />
                    </div>
                }
            />
        ),
    }

    return (
        <>
            <div className="login">
                <div className="login__inner">
                    <div className="login__title">
                        <div className="login__title__logo">
                            <Image src="/images/logo.png" alt="로고 이미지" width={45} height={32} />
                            <span className="typo t16">실시간 동시통역 서비스</span>
                        </div>
                        {/* <p className="typo t24 w500">실시간 동시통역 서비스</p> */}
                        <div className="login__title__text">
                            <p className="typo t56 w600">LOGIN</p>
                        </div>
                    </div>
                    <div className="login__form">
                        <div className="login__form__item--input">
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
                            />
                            {errorMessage && <span className="msg">※ {errorMessage}</span>}
                        </div>
                        <div className="login__form__item--btn">
                            <Button classname="typo t20" text="Sign In" onClick={onSignIn} />
                            {/* <Button classname="typo t18 signup" text="Sign Up" onClick={() => {}} /> */}
                        </div>
                        <div className="login__form__item--reset typo t17">
                            <span className="typo w500" onClick={() => setActiveModal("signup")}>
                                Sign Up
                            </span>
                            <span></span>
                            <span onClick={() => setActiveModal("emailInput")}>Forgot Password ?</span>
                        </div>
                    </div>
                    <div className="login__social">
                        <div className="login__social__item">
                            <div className="line">
                                <span></span>
                                <span className="typo t15">Social Login</span>
                                <span></span>
                            </div>
                        </div>
                        <div className="login__social__item">
                            <div className="btn">
                                <div className="btn-naver" />
                            </div>
                            <div className="btn">
                                <div className="btn-kakao" />
                            </div>
                            <div className="btn">
                                <div className="btn-google" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {contentModal[activeModal]}
        </>
    )
}

export default Login
