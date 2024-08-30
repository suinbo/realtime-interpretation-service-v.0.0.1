import SingleSettingForm from "./single/SingleSettingForm"
import { useRecoilState } from "recoil"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import SingleAudioForm from "./single/SingleAudioForm"
import MultiAudioForm from "./multi/MultiAudioForm"
import MultiSettingForm from "./multi/MultiSettingForm"
import { OptionAtom } from "@atoms/Atom"
import { NAV, STEP } from "@resources/constant"
import { ChatCreateButton, Navigation } from "@app/setting/_component"
import { FormItemProp, LabelOfStepProp, SettingContentProp, StepProp } from "@app/setting/types"
import { focusOnEmpty } from "@utils/common"
import cx from "classnames"
import { useTranslation } from "next-i18next"
import { useMediaQuery } from "react-responsive"

const ChattingView = () => {
    const { t } = useTranslation()
    const [{ language, display }, setOption] = useRecoilState(OptionAtom)
    const isMobile = useMediaQuery({
        query: "(max-width:768px)",
    })

    const [step, setStep] = useState<StepProp>(STEP[1])

    /** 셀렉박스 포커싱 */
    const [isFocused, setIsFocused] = useState<boolean>(false)

    const refs: { [key: string]: React.RefObject<HTMLInputElement> } = {
        name: useRef<HTMLInputElement>(null),
        password: useRef<HTMLInputElement>(null),
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Element

            for (const field of Object.keys(refs)) {
                const ref = refs[field]

                if (ref.current && ref.current.contains(target)) {
                    setIsFocused(false)
                    return
                }
            }
        }

        window.addEventListener("click", handleClickOutside)

        return () => {
            window.removeEventListener("click", handleClickOutside)
        }
    }, [refs])

    const [formItem, setFormItem] = useState<FormItemProp>({
        chat_id: "",
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
            [STEP[1]]: <SingleSettingForm formItem={formItem} setFormItem={setFormItem} refs={refs} />,
            [STEP[2]]: <SingleAudioForm />,
        },
        [2]: {
            [STEP[1]]: (
                <MultiSettingForm formItem={formItem} setFormItem={setFormItem} refs={refs} isFocused={isFocused} />
            ),
            [STEP[2]]: <MultiAudioForm />,
        },
    }

    // [설정] STEP 이동 네비게이터
    const Navigator = () => (
        <div className="form__nav">
            <div className={cx("form__nav__inner", step)}>
                {isMobile ? null : <span className="typo t16 w500">{labelOfStep[step].nav}</span>}
                <span
                    className={cx("form__nav__item-icon", step)}
                    onClick={() => {
                        focusOnEmpty(refs, () => {
                            if (!formItem.chat_lang[1]) {
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

    const content = useMemo(
        () => (
            <div className="content__wrapper">
                <div className="content__body--setting">
                    {/* <div className="setting-board__button">
                    <ChatSetter
                        items={[
                            { id: "setting", name: t("chat_setting") },
                            { id: "new", name: t("create_chat") },
                        ]}
                        formItem={formItem}
                        onClick={(callback: any) => {
                            focusOnEmpty(refs, () => {
                                if (!formItem.chat_lang[1]) {
                                    setIsFocused(true)
                                    return
                                }

                                callback()
                            })
                        }}
                    />
                </div> */}
                    <div className="setting-board__form">
                        <div className="form__title">
                            <span className="typo t24 w600 yello-200">{step.toUpperCase()}</span>
                            <span className="typo t24 w500">{labelOfStep[step].title}</span>
                        </div>
                        {settingContent[display][step]}
                        <div className="form__bottom">
                            {step == STEP[1] ? <div></div> : <Navigator />}
                            {step == STEP[1] ? <Navigator /> : <ChatCreateButton formItem={formItem} />}
                        </div>
                    </div>
                </div>
            </div>
        ),
        [step, formItem, settingContent]
    )

    const mobileLayout = useMemo(
        () => (
            <>
                <div className="content__wrapper-nav"></div>
                {content}
                <div className="content__wrapper-nav">
                    <Navigation view="display" position="left" />
                </div>
            </>
        ),
        [step, formItem, settingContent]
    )

    const webLayout = useMemo(
        () => (
            <>
                <div className="content__wrapper-nav">
                    <Navigation view="display" position="left" />
                </div>
                {content}
            </>
        ),
        [step, formItem, settingContent]
    )

    return <div className="content">{isMobile ? mobileLayout : webLayout}</div>
}

export default ChattingView
