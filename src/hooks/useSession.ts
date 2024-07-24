import { UserAtom } from "@atoms/Atom"
import { User } from "@supabase/supabase-js"
import { supabase } from "@utils/superbase"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSetRecoilState } from "recoil"

export const useSession = () => {
    const router = useRouter()
    const setUser = useSetRecoilState<User>(UserAtom)

    // 로그인 없이 채팅방 접속시
    // useEffect(() => {
    //     console.log("!!")
    //     const previousUrl = document.referrer
    //     const currentUrl = window.location.href

    //     if (previousUrl.includes("/chat") && !currentUrl.includes("/chat")) {
    //         router.back()
    //     }
    // }, [router])

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession()

            if (session) {
                const { user } = session
                setUser(user)
            } else {
                router.push("/")
            }
        }

        fetchUser()
    }, [])
}
