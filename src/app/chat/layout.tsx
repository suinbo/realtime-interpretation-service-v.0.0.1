import HeaderToolbar from "./HeaderToolbar"

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <div className="chatboard">
            <div className="chatboard__inner">
                <div className="header">
                    <div className="header__title">
                        <span className="typo t18">[민원 상담] 대화 1</span>
                    </div>
                    <HeaderToolbar />
                </div>
                {children}
            </div>
        </div>
    )
}

export default Layout
