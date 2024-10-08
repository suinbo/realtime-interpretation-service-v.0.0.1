"use client"

import { supabase } from "@utils/superbase"
import cookie from "@utils/cookie"
import { useState } from "react"
import { useTranslation } from "next-i18next"
import cx from "classnames"
import { Button } from "@components/form"
import { useRouter } from "next/navigation"
import { isEmptyObject } from "@utils/common"
import { useFontClass } from "@hooks/useInitFontClass"
import { notoSansKr } from "@utils/font"
import { Modal } from "@components/layout"
import { useAuth } from "@hooks/useAuth"
import "./style.scss"

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    const { t } = useTranslation()
    const router = useRouter()
    const [activeModal, setActiveModal] = useState<boolean>(false)
    const { user } = useAuth()
    const fontClass = useFontClass()

    return (
        !isEmptyObject(user) && (
            <div className={fontClass}>
                <div className="dashboard">
                    <div className="dashboard__inner">
                        <div className={cx("header", notoSansKr.className)}>
                            <div className="header__title typo t16">
                                <span>실시간 동시통역 서비스</span>
                            </div>
                            <div className="header__profile">
                                <div className="header__profile-item">
                                    <span className="header__profile-image"></span>
                                    <span className="header__profile-name typo t16">{user?.email}</span>
                                    <span
                                        className="header__profile-logout"
                                        onClick={() => setActiveModal(true)}></span>
                                </div>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
                {activeModal && (
                    <Modal.SimpleLayout
                        isActive={true}
                        hasTopIcon={false}
                        text={<>{t("logout")}</>}
                        controller={
                            <div className="popup__content--btn">
                                <Button
                                    text={t("yes")}
                                    onClick={async () => {
                                        await supabase.auth.signOut()
                                        const { data } = await supabase
                                            .from("userinfo")
                                            .update({
                                                is_logged: 0,
                                            })
                                            .eq("id", user.id)
                                            .select("*")

                                        if (data) {
                                            setActiveModal(false)
                                            cookie.clear()
                                            router.push("/")
                                        }
                                    }}
                                    classname="lined--1 typo t15 w500"
                                />
                                <Button
                                    text={t("no")}
                                    onClick={() => setActiveModal(false)}
                                    classname="secondary typo t15 w500"
                                />
                            </div>
                        }
                    />
                )}
            </div>
        )
    )
}

export default Layout
