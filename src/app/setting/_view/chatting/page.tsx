import SingleSettingForm from "./single/SingleSettingForm"
import { useRecoilValue } from "recoil"
import { useState } from "react"
import SingleAudioForm from "./single/SingleAudioForm"
import MultiAudioForm from "./multi/MultiAudioForm"
import MultiSettingForm from "./multi/MultiSettingForm"
import { optionAtom } from "@atoms/Atom"
import { FormItemProp, SettingContentProp, StepProp } from "../../types"
import { labelOfStep, STEP } from "@resources/constant"
import { ChatSetter, Navigation } from "@app/setting/_component"
import "../../style.scss"

const ChattingView = () => {
    const { language, display } = useRecoilValue(optionAtom)

    const [step, setStep] = useState<StepProp>(STEP[1])

    const [formItem, setFormItem] = useState<FormItemProp>({
        chat_nm: "",
        chat_pw: "",
        chat_lang: [language],
        host_auth: 1,
    })

    // 디스플레이 옵션-스텝 별 컨텐츠
    const settingContent: SettingContentProp = {
        [0]: {
            [STEP[1]]: <SingleSettingForm formItem={formItem} setFormItem={setFormItem} />,
            [STEP[2]]: <SingleAudioForm />,
        },
        [1]: {
            [STEP[1]]: <MultiSettingForm formItem={formItem} setFormItem={setFormItem} />,
            [STEP[2]]: <MultiAudioForm />,
        },
    }

    const Navigator = () => (
        <div className="form__nav">
            <span className="typo t24 w500 mr10">{labelOfStep[step].nav}</span>
            <span
                className="form__nav-icon"
                onClick={() => {
                    setStep(step == STEP[1] ? STEP[2] : STEP[1])
                }}></span>
        </div>
    )

    return (
        <div className="content">
            <div className="content__wrapper-nav">
                <Navigation view="display" position="left" />
            </div>
            <div className="content__wrapper">
                <div className="content__body--setting">
                    <div className="setting-board__button">
                        <ChatSetter
                            items={[
                                { id: "setting", name: "대화 설정" },
                                { id: "new", name: "새 대화 생성" },
                            ]}
                        />
                    </div>
                    <div className="setting-board__form">
                        <div className="form__title">
                            <span className="typo t28 w600 yello-200">{step}</span>
                            <span className="typo t30 w500">{labelOfStep[step].title}</span>
                        </div>
                        {settingContent[display][step]}
                        <Navigator />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChattingView
