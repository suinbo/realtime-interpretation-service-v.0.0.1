import { SetStateAction, useEffect } from "react"
import "./style.scss"

const ToastPopup = ({
    text,
    activeToast,
    setActiveToast,
    onHide,
}: {
    text: string
    activeToast: boolean
    setActiveToast: React.Dispatch<SetStateAction<boolean>>
    onHide?: () => void
}) => {
    useEffect(() => {
        if (activeToast) {
            const timerId = setTimeout(() => {
                setActiveToast(false)
                onHide && onHide()
            }, 1000)
            return () => clearTimeout(timerId)
        }
    }, [activeToast, setActiveToast])

    return (
        <div className="toast-popup">
            <span className="typo t15">{text}</span>
        </div>
    )
}

export default ToastPopup
