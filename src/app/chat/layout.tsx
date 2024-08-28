"use client"

import HeaderToolbar from "./HeaderToolbar"
import { isEmptyObject } from "@utils/common"
import { useAuth } from "@hooks/useAuth"
import "./style.scss"

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    const { user } = useAuth()

    if (isEmptyObject(user)) return

    return (
        <div className="chatboard">
            <div className="chatboard__inner">
                <HeaderToolbar />
                {children}
            </div>
        </div>
    )
}

export default Layout
