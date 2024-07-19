const HeaderToolbar = () => {
    return (
        <div className="header__toolbar">
            <div className="header__toolbar--user">
                <span className="user-name typo t18 w500">user1 님</span>
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
