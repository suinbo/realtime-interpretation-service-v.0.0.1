import { Button } from "@components/form"
import Popup from "@components/Popup"

const SimpleLayout = ({ text, controller }: { text: React.ReactNode; controller: React.ReactNode }) => (
    <Popup hasClosedBtn={false} hasTopIcon={true} style={{ width: 430 }}>
        <div className="popup__content">
            <div className="popup__content--title">
                <p className="typo t18">{text}</p>
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
}) => (
    <Popup title="대화 설정" hasClosedBtn={true} hasTopIcon={false} style={{ width: 800 }} onClose={onClose}>
        <div className="popup__content">
            <div className="popup__content--form">{formElement}</div>
            <div className="popup__content--btn--setting">
                <Button text="저장" onClick={onSave} classname="lined--1 typo t17 w500" />
                <Button text="취소" onClick={onClose} classname="secondary typo t17 w500" />
            </div>
        </div>
    </Popup>
)

export { SimpleLayout, FormLayout }
