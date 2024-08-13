import { ModalFormProp, ModalSimpleProp } from "@app/chat/types"
import { Button } from "@components/form"
import Popup from "@components/Popup"
import cx from "classnames"
import { useTranslation } from "next-i18next"

const SimpleLayout = ({
    isActive, // 팝업 동작 우선수위 부여 (알림형 팝업 > 입력 폼 팝업)
    hasTopIcon,
    text,
    controller,
}: ModalSimpleProp) => (
    <Popup hasClosedBtn={false} hasTopIcon={hasTopIcon} style={{ width: 430 }} isActive={isActive}>
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
    const { t } = useTranslation()

    return (
        <Popup
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

export { SimpleLayout, FormLayout }
