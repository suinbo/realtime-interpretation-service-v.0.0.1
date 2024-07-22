"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button, Input } from "@components/form"
import "./style.scss"
import { supabase } from "@utils/superbase"

/**
 * 로그인 화면
 */
const Login = () => {
    // const router = useRouter()

    const handleSignUp = async () => {
        //e.preventDefault();
        const { user, error } = await supabase.auth.signUp({
            email: "suin9610@gmail.com",
            password: "123456*",
        })

        if (error) {
            //   setMessage(error.message);
        }
    }

    return (
        <div className="login">
            <div className="login__inner">
                <div className="login__title">
                    <div className="login__title__logo">
                        <Image src="/images/logo.png" alt="로고 이미지" width={166} height={114} />
                    </div>
                    <div className="logo__title__text">
                        <p className="typo t30 w500">실시간 동시통역 서비스</p>
                        <p className="typo t50 w600">LOGIN</p>
                    </div>
                </div>
                <div className="login__form">
                    <div className="login__form__item">
                        <Input placeholder="ID" />
                    </div>
                    <div className="login__form__item">
                        <Input placeholder="Password" type="password" />
                    </div>
                    <Button
                        classname="typo t20 w500"
                        text="Sign In"
                        onClick={() => {
                            // router.push("/setting")
                        }}
                    />
                    <Button classname="typo t20 w500" text="Sign Up" onClick={handleSignUp} />
                </div>
            </div>
        </div>
    )
}

export default Login
