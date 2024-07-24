import React from "react"
import cx from "classnames"

const Input = ({
    type = "text",
    value,
    placeholder,
    disabled = false,
    onChange,
    onKeyDown,
    classname,
}: {
    type?: string
    value?: string
    placeholder?: string
    disabled?: boolean
    onChange?: (value: string) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    classname?: string
}) => {
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value)

    return (
        <input
            type={type}
            className={cx("input", "typo t18", classname)}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
        />
    )
}

export default Input
