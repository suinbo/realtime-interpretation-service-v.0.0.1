"use client"

import { useRef, useState } from "react"
import cx from "classnames"
import useClickOutside from "@hooks/useClickOutside"

export type SelectboxItem = {
    id: string
    name: string
}

export default function Selectbox({
    items = [],
    selectedId,
    innerElement,
    onSelect,
    style,
    isFocused,
}: {
    items: SelectboxItem[]
    selectedId?: string
    innerElement?: React.ReactNode
    onSelect: (selectedItem: SelectboxItem) => void
    style?: React.CSSProperties
    isFocused?: boolean
}) {
    const selectBoxRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState<boolean>(false)
    const [, setSelectedItem] = useState<SelectboxItem>()

    useClickOutside(selectBoxRef, () => setActive(false))

    const SelectboxList = () => (
        <div className="selectbox__item">
            <ul className="selectbox__item-list" style={style}>
                {items.map(item => (
                    <li
                        id={item.id}
                        key={item.id}
                        className="typo t16"
                        onClick={() => {
                            setSelectedItem(item)
                            onSelect(item)
                            setActive(false)
                        }}>
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    )

    return (
        <div className="selectbox">
            <div
                ref={selectBoxRef}
                className={cx("selectbox__opener", { focus: isFocused && !active })}
                onClick={() => setActive(!active)}>
                <div className="typo t16">
                    {innerElement}
                    {selectedId ? items.find(item => item.id == selectedId)?.name : "-"}
                </div>
                <span className={cx("selectbox__opener-arrow", { active })} />
            </div>
            {active && <SelectboxList />}
        </div>
    )
}
