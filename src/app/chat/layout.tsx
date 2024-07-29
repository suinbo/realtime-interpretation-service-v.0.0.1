import HeaderToolbar from "./HeaderToolbar"
import "@assets/styles/common.scss"
import "./style.scss"

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
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
