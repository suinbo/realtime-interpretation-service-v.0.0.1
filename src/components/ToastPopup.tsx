import { SetStateAction, useEffect } from "react"
import "./style.scss"

const ToastPopup = ({
    text,
    activeToast,
    setActiveToast,
}: {
    text: string
    activeToast: boolean
    setActiveToast: React.Dispatch<SetStateAction<boolean>>
}) => {
    useEffect(() => {
        if (activeToast) {
            const timerId = setTimeout(() => {
                setActiveToast(false)
            }, 1000)

            return () => clearTimeout(timerId)
        }
    }, [activeToast, setActiveToast])

    return (
        <div className="toast-popup">
            <span>{text}</span>
        </div>
    )
}

export default ToastPopup
