import SingleSettingForm from "./single/SingleSettingForm"
import { useRecoilState } from "recoil"
import { useEffect, useRef, useState } from "react"
import SingleAudioForm from "./single/SingleAudioForm"
import MultiAudioForm from "./multi/MultiAudioForm"
import MultiSettingForm from "./multi/MultiSettingForm"
import { OptionAtom } from "@atoms/Atom"
import { NAV, STEP } from "@resources/constant"
import { ChatSetter, Navigation } from "@app/setting/_component"
import { FormItemProp, LabelOfStepProp, SettingContentProp, StepProp } from "@app/setting/types"
import { focusOnEmpty } from "@utils/common"
import cx from "classnames"
import "@assets/styles/common.scss"
import "./style.scss"
import { useInitLanguage } from "@hooks/useInitLanguage"

const ChattingView = () => {
    const t = useInitLanguage()
    const [{ language, display }, setOption] = useRecoilState(OptionAtom)

    const [step, setStep] = useState<StepProp>(STEP[1])
    const [isFocused, setIsFocused] = useState<boolean>(false)

    const refs = {
        name: useRef<HTMLInputElement>(null),
        password: useRef<HTMLInputElement>(null),
    }

    const [formItem, setFormItem] = useState<FormItemProp>({
        chat_nm: "",
        chat_pw: "",
        has_chat_pw: false,
        chat_lang: [language],
        host_auth: 1,
    })

    useEffect(() => {
        if (!!formItem.chat_lang[1]) setIsFocused(false)
    }, [formItem.chat_lang])

    const labelOfStep: LabelOfStepProp = {
        [STEP[1]]: {
            nav: NAV.NEXT,
            title: t("chat_setting"),
        },
        [STEP[2]]: {
            nav: NAV.PREVIOUS,
            title: t("audio_setting"),
        },
    }

    // 디스플레이 옵션-스텝 별 컨텐츠
    const settingContent: SettingContentProp = {
        [1]: {
            [STEP[1]]: (
                <SingleSettingForm formItem={formItem} setFormItem={setFormItem} refs={refs} isFocused={isFocused} />
            ),
            [STEP[2]]: <SingleAudioForm />,
        },
        [2]: {
            [STEP[1]]: <MultiSettingForm formItem={formItem} setFormItem={setFormItem} refs={refs} />,
            [STEP[2]]: <MultiAudioForm />,
        },
    }

    // [설정] STEP 이동 네비게이터
    const Navigator = () => (
        <div className="form__nav">
            <div className={cx("form__nav__inner", step)}>
                <span className="typo t22 w500">{labelOfStep[step].nav}</span>
                <span
                    className={cx("form__nav__item-icon", step)}
                    onClick={() => {
                        focusOnEmpty(refs, () => {
                            if (display == 1 && !formItem.chat_lang[1]) {
                                setIsFocused(true)
                                return
                            }
                            setStep(step == STEP[1] ? STEP[2] : STEP[1])
                            setOption(prev => ({ ...prev, chatting: formItem }))
                        })
                    }}></span>
            </div>
        </div>
    )

    return (
        <>
            <div className="content">
                <div className="content__wrapper-nav">
                    <Navigation view="display" position="left" />
                </div>
                <div className="content__wrapper">
                    <div className="content__body--setting">
                        <div className="setting-board__button">
                            <ChatSetter
                                items={[
                                    { id: "setting", name: t("chat_setting") },
                                    { id: "new", name: t("create_chat") },
                                ]}
                                formItem={formItem}
                            />
                        </div>
                        <div className="setting-board__form">
                            <div>
                                <div className="form__title">
                                    <span className="typo t28 w600 yello-200">{step.toUpperCase()}</span>
                                    <span className="typo t28 w500">{labelOfStep[step].title}</span>
                                </div>
                                {settingContent[display][step]}
                            </div>
                            <Navigator />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChattingView
