import React, { CSSProperties, SetStateAction, useEffect, useRef } from "react"
import "./style.scss"

const Popup = ({
    children,
    hasClosedBtn = true,
    title,
    hasTopIcon = false,
    style,
    onClose,
}: {
    children: React.ReactNode
    title?: string
    hasClosedBtn?: boolean
    hasTopIcon?: boolean
    style?: CSSProperties
    onClose?: () => void
}) => {
    const popupRef = useRef<HTMLDivElement>(null)

    /** 외부 영역 클릭 방지 */
    useEffect(() => {
        const isOutsideClick = (e: Event) => {
            if (!popupRef.current?.contains(e.target as Node)) {
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
                        {title && <span className="typo t24 w500">{title}</span>}
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
