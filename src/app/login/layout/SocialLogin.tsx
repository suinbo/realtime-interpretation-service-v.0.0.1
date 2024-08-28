"use client"
import { Provider } from "@supabase/supabase-js"
import { signIn as nextAuthSignIn } from "next-auth/react"

const SocialLogin = () => {
    const onLogin = async (provider: Provider | "naver") => {
        await nextAuthSignIn(provider, { callbackUrl: "/setting" })

        // await supabase.auth.signInWithOAuth({
        //     provider,
        //     options: {
        //         redirectTo: "https://kznbsxjbhmrmoiflpupl.supabase.co/auth/v1/callback",
        //     },
        // })
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
                    <div
                        className="btn-naver"
                        //onClick={() => onLogin("naver")}
                    />
                </div>
                <div className="btn">
                    <div className="btn-kakao" />
                </div>
                <div className="btn">
                    <div
                        className="btn-google"
                        //onClick={() => onLogin("google")}
                    />
                </div>
            </div>
        </div>
    )
}

export default SocialLogin
