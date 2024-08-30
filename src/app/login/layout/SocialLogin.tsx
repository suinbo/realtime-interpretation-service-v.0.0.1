"use client"

import { REDIRECT_URL } from "@resources/constant"
import { Provider } from "@supabase/supabase-js"
import { supabase } from "@utils/superbase"

const SocialLogin = () => {
    const onLogin = async (provider: Provider) => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: REDIRECT_URL.GOOGLE,
            },
        })
    }

    const onNaverLogin = async () => {
        const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID
        const redirectUri = encodeURIComponent("http://localhost:3000/login")
        const state = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET // CSRF 보호를 위해 랜덤 문자열 생성
        const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
        window.location.href = naverLoginUrl
    }

    return (
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
                    <div className="btn-naver" onClick={onNaverLogin} />
                </div>
                <div className="btn">
                    <div className="btn-kakao" />
                </div>
                <div className="btn">
                    <div className="btn-google" onClick={() => onLogin("google")} />
                </div>
            </div>
        </div>
    )
}

export default SocialLogin
