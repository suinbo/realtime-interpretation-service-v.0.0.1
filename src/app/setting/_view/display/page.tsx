"use client"

import { ButtonList, Navigation } from "@app/setting/_component"
import { useTranslation } from "next-i18next"
import { useMediaQuery } from "react-responsive"

const DisplayView = () => {
    const { t } = useTranslation()
    const isMobile = useMediaQuery({
        query: "(max-width:768px)",
    })

    const Content = () => (
        <div className="content__wrapper">
            <div className="content__title">
                <p className="typo t32">{t("select_display")}</p>
            </div>
            <div className="content__body--display">
                <ul className="content__body--display-list">
                    <ButtonList
                        content="display"
                        items={[
                            { id: "2", name: t("display_2") },
                            { id: "1", name: t("display_1") },
                        ]}
                    />
                </ul>
            </div>
        </div>
    )

    const MobileLayout = () => (
        <>
            <div className="content__wrapper-nav"></div>
            <Content />
            <div className="content__wrapper-nav">
                <Navigation view="language" position="left" />
                <Navigation view="chatting" position="right" />
            </div>
        </>
    )

    const WebLayout = () => (
        <>
            <div className="content__wrapper-nav">
                <Navigation view="language" position="left" />
            </div>
            <Content />
            <div className="content__wrapper-nav">
                <Navigation view="chatting" position="right" />
            </div>
        </>
    )

    return <div className="content">{isMobile ? <MobileLayout /> : <WebLayout />}</div>
}

export default DisplayView
