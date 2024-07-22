"use client"

import { ButtonList, Navigation } from "@app/setting/_component"

const DisplayView = () => {
    return (
        <div className="content">
            <div className="content__wrapper-nav">
                <Navigation view="language" position="left" />
            </div>
            <div className="content__wrapper">
                <div className="content__title">
                    <p className="typo t32">
                        <b>디스플레이 옵션</b>을 선택해주세요.
                    </p>
                    <p className="typo t24">
                        Please select a <b>display option</b>.
                    </p>
                </div>
                <div className="content__body--display">
                    <ul className="content__body--display-list">
                        <ButtonList
                            content="display"
                            items={[
                                { id: 0, name: "1대" },
                                { id: 1, name: "2대" },
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
