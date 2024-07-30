import React, { CSSProperties, SetStateAction, useEffect, useRef, useState } from "react"
import "./style.scss"

const Popup = ({
    popupId,
    children,
    hasClosedBtn = true,
    title,
    hasTopIcon = false,
    style,
    onClose,
}: {
    popupId?: string //팝업 동시 사용시 고유 식별
    children: React.ReactNode
    title?: string
    hasClosedBtn?: boolean
    hasTopIcon?: boolean
    style?: CSSProperties
    onClose?: () => void
}) => {
    const popupRef = useRef<HTMLDivElement>(null)
    const [activePopupId, setActivePopupId] = useState<string>("")

    useEffect(() => {
        popupId && setActivePopupId(popupId)
    }, [])

    /** 외부 영역 클릭 방지 */
    useEffect(() => {
        const isOutsideClick = (e: Event) => {
            if (activePopupId === popupId && !popupRef.current?.contains(e.target as Node)) {
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
        <div className="popup" ref={popupRef} style={style}>
            {hasTopIcon && (
                <div className="popup__icon">
                    <span></span>
                </div>
            )}
            <div className="popup__inner">
                {hasClosedBtn && (
                    <div className="popup__header">
                        {title && <span className="typo t22 w500">{title}</span>}
                        <div className="popup__header--button" onClick={onClose}>
                            <span className="close-btn"></span>
                        </div>
                    </div>
                )}
                {children}
            </div>
        </div>
    )
}

export default Popup
