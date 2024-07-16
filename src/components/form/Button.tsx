import cx from "classnames"
import React from "react"

const Button = ({
    onClick,
    text,
    disabled,
    classname,
    children,
    theme,
}: {
    onClick: () => void
    text?: string | React.ReactNode
    disabled?: boolean
    classname?: string
    children?: React.ReactNode
    theme?: string
}) => {
    return (
        <button className={cx("button", theme, classname, { disabled })} onClick={() => !disabled && onClick()}>
            {children ?? text}
        </button>
    )
}

export default Button
