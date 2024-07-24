"use client"

import { useRecoilValue } from "recoil"
import { User } from "@supabase/supabase-js"
import { UserAtom } from "@atoms/Atom"
import { useSession } from "@hooks/useSession"
import "./style.scss"

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    const user = useRecoilValue<User>(UserAtom)

    useSession()

    return (
        <div className="dashboard">
            <div className="dashboard__inner">
                <div className="header">
                    <div className="header__title">
                        <span>실시간 동시통역 서비스</span>
                    </div>
                    <div className="header__profile">
                        <div className="header__profile-item">
                            <span className="header__profile-image"></span>
                            <span className="header__profile-name">{user?.email}</span>
                        </div>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Layout
