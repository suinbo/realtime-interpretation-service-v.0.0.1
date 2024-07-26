"use client"

import { UserAtom } from "@atoms/Atom"
import { useSession } from "@hooks/useSession"
import { useState } from "react"
import { useRecoilValue } from "recoil"
import ModalBySetting from "./_component/ModalBySetting"

const HeaderToolbar = () => {
    useSession()

    const user = useRecoilValue(UserAtom)
    const [view, setView] = useState<string>("")

    return (
        <>
            <div className="header__toolbar">
                <div className="header__toolbar--user">
                    <span className="user-name typo t16">{user?.email}</span>
                </div>
                <div className="header__toolbar--menu">
                    <span className="menu-share" onClick={() => setView("share")} />
                    <span className="menu-setting" onClick={() => setView("setting")} />
                    <span className="menu-close" onClick={() => setView("close")} />
                </div>
            </div>
            <ModalBySetting view={view} setView={setView} />
        </>
    )
}

export default HeaderToolbar
