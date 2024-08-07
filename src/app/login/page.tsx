"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button, Input } from "@components/form"
import { supabase } from "@utils/superbase"
import { useRef, useState } from "react"
import { useSetRecoilState } from "recoil"
import { UserAtom } from "@atoms/Atom"
import { User } from "@supabase/supabase-js"
import { focusOnEmpty } from "@utils/common"
import SignupModal from "./modal/SignupModal"
import ResetPasswordModal from "./modal/ResetPasswordModal"
import CheckEmailModal from "./modal/CheckEmailModal"
import { LoginProp } from "@app/setting/types"
import "@assets/styles/common.scss"
import "./style.scss"

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
        emailInput: <CheckEmailModal activeModal={activeModal} setActiveModal={setActiveModal} />,
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
                        <div className="login__title__text">
                            <p className="typo t56 w600">LOGIN</p>
                        </div>
                    </div>
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
                                onKeyDown={e => e.key == "Enter" && onSignIn()}
                            />
                            {errorMessage && <span className="alert">※ {errorMessage}</span>}
                        </form>
                        <div className="login__form__item--btn">
                            <Button classname="typo t20" text="Sign In" onClick={onSignIn} />
                            <Button
                                classname="typo t18 signup"
                                text="Sign Up"
                                onClick={() => setActiveModal("signup")}
                            />
                        </div>
                        <div className="login__form__item--reset typo t17">
                            {/* <span className="typo w500" onClick={() => setActiveModal("signup")}>
                                Sign Up
                            </span>
                            <span></span> */}
                            <span className="typo t15" onClick={() => setActiveModal("emailInput")}>
                                Forgot Password ?
                            </span>
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
