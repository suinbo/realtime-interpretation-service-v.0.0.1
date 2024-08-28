import { ModalCustomProp, ModalFormProp, ModalInputCheckProp, ModalNoticeProp, ModalSimpleProp } from "@app/chat/types"
import { Button } from "@components/form"
import Popup from "@components/Popup"
import { useInitLanguage } from "@hooks/useInitLanguage"
import cx from "classnames"
import { useTranslation } from "next-i18next"

const SimpleLayout = ({
    isActive, // 팝업 동작 우선수위 부여 (알림형 팝업 > 입력 폼 팝업)
    hasTopIcon,
    text,
    controller,
}: ModalSimpleProp) => (
    <Popup hasClosedBtn={false} hasTopIcon={hasTopIcon} isActive={isActive} classname="s430">
        <div className="popup__content">
            <div className="popup__content--title">
                <p className={cx("typo t16", { notice: isActive })}>{text}</p>
            </div>
            {controller}
        </div>
    </Popup>
)

const FormLayout = ({
    title, // 설정 언어 변경 팝업만 가짐
    formElement,
    isActive,
    onClose,
    onSave,
}: ModalFormProp) => {
    const { i18n } = useTranslation()
    const { t } = useInitLanguage(i18n.language)

    return (
        <Popup
            classname="s900"
            isActive={isActive}
            title={title ?? t("chat_setting")}
            hasClosedBtn={true}
            hasTopIcon={false}
            onClose={onClose}>
            <div className="popup__content">
                <div className="popup__content--form">{formElement}</div>
                <div className="popup__content--btn--setting">
                    <Button text={title ? "Yes" : t("save")} onClick={onSave} classname="lined--1 typo t15 w500" />
                    <Button text={title ? "No" : t("cancel")} onClick={onClose} classname="secondary typo t15 w500" />
                </div>
            </div>
        </Popup>
    )
}

const CustomLayout = ({ isActive, formElement, titleElement, onClose }: ModalCustomProp) => {
    return (
        <Popup hasClosedBtn={false} isActive={isActive} classname="s430">
            <div className="popup__content">
                <div className="popup__content--title">
                    {titleElement}
                    {onClose && <span className="inner-close-btn" onClick={onClose} />}
                </div>
                <div className="popup__content--input">
                    <div className="password-input">{formElement}</div>
                </div>
            </div>
        </Popup>
    )
}

const InputCheckLayout = ({ title, isActive, formElement, onClose }: ModalInputCheckProp) => {
    const data = { isActive, formElement, titleElement: <p className="typo t16">{title}</p>, onClose }
    return <CustomLayout {...data} />
}

const NoticeLayout = ({ title, subtitle, isActive, formElement, onClose }: ModalNoticeProp) => {
    const data = {
        isActive,
        formElement,
        titleElement: (
            <p className="typo t18 notice">
                <span className="typo w600">{title}</span>
                <span className="typo t14">{subtitle}</span>
            </p>
        ),
        onClose,
    }
    return <CustomLayout {...data} />
}

const Modal = {
    SimpleLayout,
    FormLayout,
    InputCheckLayout,
    NoticeLayout,
}

export default Modal
