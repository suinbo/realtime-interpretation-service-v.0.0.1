import Popup from "@components/Popup"

const PopupLayout = ({ text, controller }: { text: React.ReactNode; controller: React.ReactNode }) => (
    <Popup hasClosedBtn={false} hasTopIcon={true} style={{ width: 430 }}>
        <div className="popup__content">
            <div className="popup__content--title">
                <p className="typo t18">{text}</p>
            </div>
            {controller}
        </div>
    </Popup>
)

export default PopupLayout
