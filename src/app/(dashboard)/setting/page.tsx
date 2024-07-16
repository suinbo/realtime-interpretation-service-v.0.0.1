"use client"

import { useRecoilValue } from "recoil"
import { useState } from "react"
import { optionAtom } from "../../../atoms/Atom"
import { FormItemProp, SettingContentProp, StepProp } from "../../../types/types"
import { labelOfStep, STEP } from "../../../resources/constant"
import Navigation from "../_component/Navigation"
import "../style.scss"
import ChatSetter from "../_component/ChatSetter"
import SingleSettingForm from "./_component/single/SingleSettingForm"
import SingleAudioForm from "./_component/single/SingleAudioForm"
import MultiSettingForm from "./_component/multi/MultiSettingForm"
import MultiAudioForm from "./_component/multi/MultiAudioForm"

const SettingDashboard = () => {
    const { language, display } = useRecoilValue(optionAtom)

    const [step, setStep] = useState<StepProp>(STEP[1])

    const [formItem, setFormItem] = useState<FormItemProp>({
        chat_nm: "",
        chat_lang: [language],
        chat_pw: "",
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
        <>
            <div className="content">
                <div className="content__wrapper-nav">
                    <Navigation target="/display" position="left" />
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
        </>
    )
}

export default SettingDashboard
