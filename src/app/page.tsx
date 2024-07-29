"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button, Input } from "@components/form"
import { supabase } from "@utils/superbase"
import { useState } from "react"
import { useSetRecoilState } from "recoil"
import { LoginProp } from "./setting/types"
import { UserAtom } from "@atoms/Atom"
import { User } from "@supabase/supabase-js"
import "./style.scss"

/**
 * 로그인 화면
 */
const Login = () => {
    const router = useRouter()
    const setUser = useSetRecoilState<User>(UserAtom)
    const [{ email, password }, setInput] = useState<LoginProp>({ email: "", password: "" })

    const onSignIn = async () => {
        //e.preventDefault();
        const { user, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error("Error signing in:", error.message)
        } else {
            setUser(user)
            router.push("/setting")
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
                            placeholder="Email"
                            value={email}
                            onChange={email => setInput(prev => ({ ...prev, email }))}
                        />
                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={password => setInput(prev => ({ ...prev, password }))}
                        />
                    </div>
                    <div className="login__form__item--btn">
                        <Button
                            classname="typo t20"
                            text="Sign In"
                            onClick={() => {
                                onSignIn()
                                // router.push("/setting")
                            }}
                        />
                        <Button classname="typo t18 signup" text="Sign Up" onClick={() => {}} />
                    </div>
                    <div className="login__form__item--reset typo w500">
                        <span>Forgot Password ?</span>
                    </div>
                </div>
                <div className="login__social">
                    <div className="login__social__item">
                        <div className="line">
                            <span></span>
                            <span className="typo t16">Social Login</span>
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
    )
}

export default Login
