import cx from "classnames"
import React, { RefObject } from "react"

const Button = ({
    refs,
    onClick,
    onKeyUp,
    onKeyDown,
    text,
    disabled,
    classname,
    children,
    theme,
}: {
    refs?: RefObject<HTMLButtonElement>
    onClick: () => void
    onKeyUp?: (e: React.KeyboardEvent<HTMLButtonElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void
    text?: string | React.ReactNode
    disabled?: boolean
    classname?: string
    children?: React.ReactNode
    theme?: string
}) => {
    return (
        <button
            ref={refs}
            className={cx("button", theme, classname)}
            onClick={() => !disabled && onClick()}
            onKeyUp={e => onKeyUp && onKeyUp(e)}
            onKeyDown={e => onKeyDown && onKeyDown(e)}
            disabled={disabled}>
            {children ?? text}
        </button>
    )
}

export default Button
