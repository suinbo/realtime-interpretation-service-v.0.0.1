"use client"

import { ChatroomAtom, UserAtom } from "@atoms/Atom"
import { useSession } from "@hooks/useSession"
import { useState } from "react"
import { useRecoilValue } from "recoil"
import ModalBySetting from "./_component/modal/ModalBySetting"
import { useInitLanguage } from "@hooks/useInitLanguage"
import { useQueryParams } from "@hooks/useQueryParams"
import { useView } from "./_hook/useView"

const HeaderToolbar = () => {
    useSession()

    const { t } = useInitLanguage()
    const user = useRecoilValue(UserAtom)
    const { host } = useQueryParams()
    const { chat_nm } = useRecoilValue(ChatroomAtom)
    const { view, setView } = useView()

    return (
        <div className="header">
            <div className="header__title">
                <span className="typo t16">{t("chat", { val: chat_nm })}</span>
            </div>
            <div className="header__toolbar">
                <div className="header__toolbar--user">
                    <span className="user-name typo t16">{user?.email}</span>
                </div>
                <div className="header__toolbar--menu">
                    <span className="menu-share" onClick={() => setView("share")} />
                    <span className="menu-setting" onClick={() => setView("setting")} />
                    {host == user.id && <span className="menu-close" onClick={() => setView("close")} />}
                </div>
            </div>
            <ModalBySetting view={view} setView={setView} />
        </div>
    )
}

export default HeaderToolbar
