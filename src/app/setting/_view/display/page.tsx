"use client"

import { ButtonList, Navigation } from "@app/setting/_component"
import { useInitLanguage } from "@hooks/useInitLanguage"

const DisplayView = () => {
    const t = useInitLanguage()

    return (
        <div className="content">
            <div className="content__wrapper-nav">
                <Navigation view="language" position="left" />
            </div>
            <div className="content__wrapper">
                <div className="content__title">
                    {/* <p className="typo t32"></p> */}
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
            <div className="content__wrapper-nav">
                <Navigation view="chatting" position="right" />
            </div>
        </div>
    )
}

export default DisplayView
