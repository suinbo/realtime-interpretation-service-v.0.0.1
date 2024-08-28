import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from "@supabase/supabase-js"

export const authOptions: NextAuthOptions = {
    providers: [
        NaverProvider({
            clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET!,
        }),
        KakaoProvider({
            clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            const { email, name } = user

            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // 서비스 역할 키
            )

            const { data: authUser } = await supabase.from("userinfo").select("id").eq("email", email).single()

            // 사용자가 이미 존재하는지 확인
            if (authUser) {
                await supabase.from("userinfo").update({ is_logged: 1 }).eq("id", authUser.id)
            } else {
                const { error } = await supabase.auth.admin.createUser({
                    email: email as string,
                    user_metadata: {
                        name,
                    },
                    password: "undefined", // 이메일 링크로만 가입
                })

                if (error) {
                    console.error("Supabase 사용자 동기화 실패:", error.message)
                    return false
                }
            }

            return true // 로그인 성공
        },
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
