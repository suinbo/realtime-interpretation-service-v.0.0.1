"use client"

import { ButtonList, Navigation } from "@app/setting/_component"
import { useTranslation } from "next-i18next"

const DisplayView = () => {
    const { t, i18n } = useTranslation()

    console.log(t("display_1"))

    return (
        <div className="content">
            <div className="content__wrapper-nav">
                <Navigation view="language" position="left" />
            </div>
            <div className="content__wrapper">
                <div className="content__title">
                    {/* <p className="typo t32"></p> */}
                    <p className="typo t32">
                        {t("select")}
                        <b>{t("diplay_option")}</b>.
                    </p>
                </div>
                <div className="content__body--display">
                    <ul className="content__body--display-list">
                        <ButtonList
                            content="display"
                            items={[
                                { id: "1", name: t("display_1") },
                                { id: "2", name: t("display_2") },
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
