"use client"

import { ChatroomAtom } from "@atoms/Atom"
import { useSession } from "@hooks/useSession"
import { useRecoilValue } from "recoil"
import ModalBySetting from "./_component/modal/ModalBySetting"
import { useView } from "./_hook/useView"
import { useTranslation } from "next-i18next"

const HeaderToolbar = () => {
    const { t } = useTranslation()
    const { user } = useSession()
    const { room_title, creator_id } = useRecoilValue(ChatroomAtom)
    const { view, setView } = useView()

    return (
        <div className="header">
            <div className="header__title">
                <span className="typo t16">{t("chat", { val: room_title })}</span>
            </div>
            <div className="header__toolbar">
                <div className="header__toolbar--user">
                    <span className="user-name typo t16">{user?.email}</span>
                </div>
                <div className="header__toolbar--menu">
                    <span className="menu-share" onClick={() => setView("share")} />
                    <span className="menu-setting" onClick={() => setView("setting")} />
                    {creator_id == user.id && <span className="menu-close" onClick={() => setView("close")} />}
                </div>
            </div>
            <ModalBySetting view={view} setView={setView} />
        </div>
    )
}

export default HeaderToolbar
