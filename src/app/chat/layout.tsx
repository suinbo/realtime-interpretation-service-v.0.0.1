"use client"

import { useSession } from "@hooks/useSession"
import HeaderToolbar from "./HeaderToolbar"
import { isEmptyObject } from "@utils/common"
import "./style.scss"

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    const { user } = useSession()

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
