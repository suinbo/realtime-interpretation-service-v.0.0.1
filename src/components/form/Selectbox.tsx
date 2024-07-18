"use client"

import { SetStateAction, useRef, useState } from "react"
import cx from "classnames"
import useClickOutside from "../../hooks/useClickOutside"

export type SelectboxItem = {
    id: string
    name: string
}

export default function Selectbox({
    items = [],
    selectedId,
    innerElement,
    setSelectedItem,
    style,
}: {
    items: SelectboxItem[]
    selectedId?: string
    innerElement?: React.ReactNode
    setSelectedItem: React.Dispatch<SetStateAction<SelectboxItem>>
    style?: React.CSSProperties
}) {
    const selectBoxRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState<boolean>(false)

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
