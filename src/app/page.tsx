"use client"

import Image from "next/image"
import { Button, Input } from "../components/form"
import { useRouter } from "next/navigation"
import "./style.scss"

/**
 * 로그인 화면
 */
const Login = () => {
    const router = useRouter()

    return (
        <div className="login">
            <div className="login__inner">
                <div className="login__title">
                    <div className="login__title__logo">
                        <Image src="/images/logo.png" alt="로고 이미지" width={166} height={114} />
                    </div>
                    <div className="logo__title__text">
                        <h3>실시간 동시통역 서비스</h3>
                        <h1>LOGIN</h1>
                    </div>
                </div>
                <div className="login__form">
                    <div className="login__form__item">
                        <Input placeholder="ID" />
                    </div>
                    <div className="login__form__item">
                        <Input placeholder="Password" type="password" />
                    </div>
                    <Button classname="typo t20 w500" text="Sign In" onClick={() => router.push("/language")} />
                </div>
            </div>
        </div>
    )
}

export default Login
