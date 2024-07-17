import "./style.scss"

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
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
                            <span className="header__profile-name">담당자 1</span>
                        </div>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Layout
