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
}: {
    items: SelectboxItem[]
    selectedId?: string
    innerElement?: React.ReactNode
    onSelect: (selectedItem: SelectboxItem) => void
    style?: React.CSSProperties
}) {
    const selectBoxRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<SelectboxItem>()

    useClickOutside(selectBoxRef, () => setActive(false))

    const SelectboxList = () => (
        <div className="selectbox__item">
            <ul className="selectbox__item-list" style={style}>
                {items.map(item => (
                    <li
                        id={item.id}
                        key={item.id}
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
        <div className="selectbox typo t18">
            <div ref={selectBoxRef} className="selectbox__opener" onClick={() => setActive(!active)}>
                <div>
                    {innerElement}
                    {selectedId ? items.find(item => item.id == selectedId)?.name : "-"}
                </div>
                <span className={cx("selectbox__opener-arrow", { active })} />
            </div>
            {active && <SelectboxList />}
        </div>
    )
}
