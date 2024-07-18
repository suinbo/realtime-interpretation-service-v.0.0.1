import SingleSettingForm from "./single/SingleSettingForm"
import { useRecoilState } from "recoil"
import { useState } from "react"
import SingleAudioForm from "./single/SingleAudioForm"
import MultiAudioForm from "./multi/MultiAudioForm"
import MultiSettingForm from "./multi/MultiSettingForm"
import { optionAtom } from "@atoms/Atom"
import { labelOfStep, STEP } from "@resources/constant"
import { ChatSetter, Navigation } from "@app/setting/_component"
import { FormItemProp, SettingContentProp, StepProp } from "@app/setting/types"
import cx from "classnames"
import "./style.scss"

const ChattingView = () => {
    const [{ language, display }, setOption] = useRecoilState(optionAtom)

    const [step, setStep] = useState<StepProp>(STEP[1])

    const [formItem, setFormItem] = useState<FormItemProp>({
        chat_nm: "",
        chat_pw: "",
        has_chat_pw: false,
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
            <div className={cx("form__nav__inner", step)}>
                <span className="typo t24 w500">{labelOfStep[step].nav}</span>
                <span
                    className={cx("form__nav__item-icon", step)}
                    onClick={() => {
                        setStep(step == STEP[1] ? STEP[2] : STEP[1])
                        setOption(prev => ({ ...prev, chatting: formItem }))
                    }}></span>
            </div>
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
