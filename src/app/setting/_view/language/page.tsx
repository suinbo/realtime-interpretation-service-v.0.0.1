import { ButtonList, Navigation } from "@app/setting/_component"
import { languages } from "@resources/data"

const LanguageView = () => {
    return (
        <div className="content">
            <div className="content__wrapper-nav" />
            <div className="content__wrapper">
                <div className="content__title">
                    <p className="typo t32">
                        <b>언어</b>를 선택해주세요.
                    </p>
                    <p className="typo t24">
                        Please select a <b>language</b>.
                    </p>
                </div>
                <div className="content__body--language">
                    <ul className="content__body--language-list">
                        <ButtonList content="language" items={languages} />
                    </ul>
                </div>
            </div>
            <div className="content__wrapper-nav">
                <Navigation view="display" position="right" />
            </div>
        </div>
    )
}

export default LanguageView
