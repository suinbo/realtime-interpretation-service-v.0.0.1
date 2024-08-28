import { UserAtom } from "@atoms/Atom"
import { User } from "@supabase/supabase-js"
import { supabase } from "@utils/superbase"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useRecoilState } from "recoil"

export const useAuth = () => {
    const router = useRouter()
    const [user, setUser] = useRecoilState<User | { email: string; name: string; image: string }>(UserAtom)
    //next-auth 사용하는 경우
    //const { data: sessionData, status } = useSession()

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
                localStorage.setItem("redirectTo", location.pathname + location.search)
                router.push("/")
            }
        }

        fetchUser()
    }, [])

    return { user }
}
