import { useTranslation } from "next-i18next"
import { useEffect, useRef } from "react"

/**
 * 승인 요청 수락 대기 화면
 */
const PendintApproval = () => {
    const { t } = useTranslation()

    const spinnerRef = useRef<HTMLDivElement>(null)

    /** 외부 영역 클릭 방지 */
    useEffect(() => {
        const isOutsideClick = (e: Event) => {
            if (spinnerRef.current && !spinnerRef.current.contains(e.target as Node)) {
                e.stopPropagation() // 클릭 방지
                e.preventDefault() // 포커싱 방지
            }
        }

        !!window && window.addEventListener("click", isOutsideClick, true)
        !!window && window.addEventListener("mousedown", isOutsideClick, true)

        return () => {
            if (!window) return
            window.removeEventListener("click", isOutsideClick, true)
            window.removeEventListener("mousedown", isOutsideClick, true)
        }
    }, [])

    return (
        <div className="spinner" ref={spinnerRef}>
            <div className="spinner__item">
                <div className="spinner__item--bar" />
                <p className="spinner__item--text">{t("waiting_approval")}</p>
            </div>
        </div>
    )
}

export default PendintApproval
