import React, { RefObject } from "react"
import cx from "classnames"

const Input = ({
    refs,
    type = "text",
    value,
    placeholder,
    disabled = false,
    onChange,
    onKeyDown,
    classname,
}: {
    refs?: RefObject<HTMLInputElement>
    type?: string
    value?: string
    placeholder: string
    disabled?: boolean
    onChange?: (value: string) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    classname?: string
}) => {
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value)

    return (
        <input
            ref={refs}
            type={type}
            className={cx("input", classname)}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="current-password"
        />
    )
}

export default Input
