import { Button } from "@components/form"
import Popup from "@components/Popup"
import { useInitLanguage } from "@hooks/useInitLanguage"
import cx from "classnames"

const SimpleLayout = ({
    isActive, // 팝업 동작 우선수위 부여 (알림형 팝업 > 입력 폼 팝업)
    hasTopIcon,
    text,
    controller,
}: {
    isActive?: boolean
    hasTopIcon?: boolean
    text: React.ReactNode
    controller: React.ReactNode
}) => (
    <Popup hasClosedBtn={false} hasTopIcon={hasTopIcon} style={{ width: 430 }} isActive={isActive}>
        <div className="popup__content">
            <div className="popup__content--title">
                <p className={cx("typo t18", { notice: isActive })}>{text}</p>
            </div>
            {controller}
        </div>
    </Popup>
)

const FormLayout = ({
    formElement,
    onClose,
    onSave,
}: {
    formElement: React.ReactNode
    onClose: () => void
    onSave: () => void
}) => {
    const t = useInitLanguage()

    return (
        <Popup
            title={t("chat_setting")}
            hasClosedBtn={true}
            hasTopIcon={false}
            style={{ width: 800 }}
            onClose={onClose}>
            <div className="popup__content">
                <div className="popup__content--form">{formElement}</div>
                <div className="popup__content--btn--setting">
                    <Button text={t("save")} onClick={onSave} classname="lined--1 typo t15 w500" />
                    <Button text={t("cancel")} onClick={onClose} classname="secondary typo t15 w500" />
                </div>
            </div>
        </Popup>
    )
}

export { SimpleLayout, FormLayout }
