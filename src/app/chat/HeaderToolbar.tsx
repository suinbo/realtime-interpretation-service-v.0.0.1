"use client"

import { UserAtom } from "@atoms/Atom"
import { useSession } from "@hooks/useSession"
import { useRecoilValue } from "recoil"

const HeaderToolbar = () => {
    useSession()

    const user = useRecoilValue(UserAtom)

    return (
        <div className="header__toolbar">
            <div className="header__toolbar--user">
                <span className="user-name typo t16">{user?.email}</span>
            </div>
            <div className="header__toolbar--menu">
                <span className="menu-share" />
                <span className="menu-setting" />
                <span className="menu-close" />
            </div>
        </div>
    )
}

export default HeaderToolbar
