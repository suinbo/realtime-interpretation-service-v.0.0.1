"use client"

import { useState } from "react"

const RadioGroup = ({
    items,
    name,
    selectedId,
    onChange,
}: {
    items: { id: string; value: string }[]
    name: string
    selectedId: string
    onChange: (selectedId: string) => void
}) => {
    const [selectedItemId, setSelectedItemId] = useState<string>(selectedId)

    const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id } = e.target
        setSelectedItemId(id)
        onChange(id)
    }

    return (
        <div className="radio">
            <ul className="radio-list">
                {items.map(item => (
                    <li key={item.id} className="radio-button">
                        <label htmlFor={item.id}>
                            <input
                                type="radio"
                                id={item.id}
                                name={name}
                                value={item.value}
                                onChange={onRadioChange}
                                checked={item.id == selectedItemId}
                            />
                            {item.value}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RadioGroup
