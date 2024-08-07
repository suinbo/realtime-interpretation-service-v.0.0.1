import Popup from "@components/Popup"
import { EmailInput } from "../../chat/_component"
import { SetStateAction } from "react"

/** 이메일 확인 모달 */
const CheckEmailModal = ({
    activeModal,
    setActiveModal,
}: {
    activeModal: string
    setActiveModal: React.Dispatch<SetStateAction<string>>
}) => {
    return (
        <Popup hasClosedBtn={false} style={{ width: 430 }} isActive={activeModal == "emailInput"}>
            <div className="popup__content">
                <div className="popup__content--title">
                    <p className="typo t18">
                        Please enter the <b>Email</b>.
                    </p>
                    <span className="inner-close-btn" onClick={() => setActiveModal("")} />
                </div>
                <div className="popup__content--input">
                    <EmailInput setActiveModal={setActiveModal} />
                </div>
            </div>
        </Popup>
    )
}

export default CheckEmailModal
