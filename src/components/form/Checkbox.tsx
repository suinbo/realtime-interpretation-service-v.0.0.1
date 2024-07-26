"use client"

import { useState } from "react"
import cx from "classnames"

const Checkbox = ({
    id,
    label,
    isCheck = false,
    disabled = false,
    onChange,
}: {
    id: string
    label?: string
    isCheck?: boolean
    disabled?: boolean
    onChange?: (isChecked: boolean) => void
}) => {
    const [checked, setChecked] = useState<boolean>(isCheck)

    return (
        <div className="checkbox">
            <label className={cx("checkbox-label ", { checked })} htmlFor={id} />
            {label}
            <input
                id={id}
                type="checkbox"
                disabled={disabled}
                checked={checked}
                onChange={() => {
                    onChange && onChange(!checked)
                    setChecked(!checked)
                }}
            />
        </div>
    )
}

export default Checkbox
