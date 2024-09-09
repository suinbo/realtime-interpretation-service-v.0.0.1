"use client"

import { UserAtom } from "@atoms/Atom"
import { useQueryParams } from "@hooks/useQueryParams"
import { REDIRECT_URL } from "@resources/constant"
import { Provider, User } from "@supabase/supabase-js"
import { supabase } from "@utils/superbase"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSetRecoilState } from "recoil"

const SocialLogin = () => {
    const router = useRouter()
    const setUser = useSetRecoilState<User>(UserAtom)
    const { code, state } = useQueryParams()

    useEffect(() => {
        if (code && state) {
            const authenticateUser = async (email: string, id: string) => {
                const { data } = await supabase.auth.signInWithPassword({
                    email,
                    password: id,
                })

                if (data) {
                    setUser({ email, id } as User)
                    router.push("/setting")
                }
            }

            const signUpAndAuthenticateUser = async (email: string, id: string) => {
                await supabase.auth.signUp({
                    email,
                    password: id,
                    options: {
                        emailRedirectTo: "/login",
                    },
                })

                await authenticateUser(email, id)
            }

            const getToken = async () => {
                try {
                    const response = await fetch(`/api/naver`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: new URLSearchParams({
                            code: code as string,
                            state: state as string,
                            grant_type: "authorization_code",
                            client_id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
                            client_secret: process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET!,
                        }).toString(),
                    })

                    const data = await response.json()

                    if (data) {
                        const { email, id, name } = data

                        // Check if user exists
                        const { data: user } = await supabase.from("userinfo").select("*").eq("email", email)

                        if (user?.length) {
                            await authenticateUser(email, id)
                        } else {
                            await signUpAndAuthenticateUser(email, id)
                        }
                    }
                } catch (error) {
                    console.error("Error during authentication:", error)
                }
            }

            getToken()
        }
    }, [code, state])

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
        const state = encodeURIComponent(clientId as string) // CSRF 보호를 위해 랜덤 문자열 생성
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
