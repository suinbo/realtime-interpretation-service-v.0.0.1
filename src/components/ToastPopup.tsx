import "./style.scss"

const ToastPopup = ({ text }: { text: string }) => {
    return (
        <div className="toast-popup">
            <span>{text}</span>
        </div>
    )
}

export default ToastPopup
