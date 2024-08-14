import { UserAtom } from "@atoms/Atom"
import { User } from "@supabase/supabase-js"
import { supabase } from "@utils/superbase"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useRecoilState } from "recoil"

export const useSession = () => {
    const router = useRouter()
    const [user, setUser] = useRecoilState<User>(UserAtom)

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
