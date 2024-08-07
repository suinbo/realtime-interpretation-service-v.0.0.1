"use client"

import { OptionAtom, UserAtom } from "@atoms/Atom"
import { VIEW } from "@resources/constant"
import { User } from "@supabase/supabase-js"
import { supabase } from "@utils/superbase"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSetRecoilState } from "recoil"
import { useFontClass } from "@hooks/useInitFontClass"

const defaultOption = {
    view: VIEW.LANGUAGE,
    language: "en",
    display: 2,
    chatting: {
        chat_id: "",
        chat_nm: "",
        chat_lang: [""],
        has_chat_pw: false,
        chat_pw: null,
        host_auth: 0,
    },
}

const Page = () => {
    const router = useRouter()
    const setUser = useSetRecoilState<User>(UserAtom)
    const setOptions = useSetRecoilState(OptionAtom)
    const fontClass = useFontClass()

    useEffect(() => {
        setOptions(defaultOption)

        const fetchUser = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession()

            if (session) {
                const { user } = session
                setUser(user)
                router.push("/setting")
            } else {
                router.push("/login")
            }
        }

        fetchUser()
    }, [])

    return <div className={fontClass}></div>
}

export default Page
