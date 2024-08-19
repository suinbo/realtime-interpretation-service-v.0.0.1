"use client"

import { useEffect, useRef, useState } from "react"
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
    const [{ top, width }, setPosition] = useState<any>({ top: 0, width: 0 })

    useClickOutside(selectBoxRef, () => {
        setActive(false)
    })

    const controlPosition = () => {
        if (selectBoxRef.current) {
            const { top, width, height } = selectBoxRef.current.getBoundingClientRect()
            const parentRect = selectBoxRef.current.offsetParent?.getBoundingClientRect()
            setPosition({ top: top - (parentRect?.top || 0) + height + 10, width })
        }
    }

    // 최상단 부모 노드 찾기
    const findScrollParent = (node: HTMLElement | null) => {
        if (!node) return null
        if (node.scrollHeight > node.clientHeight) {
            return node
        }
        return findScrollParent(node.parentElement)
    }

    useEffect(() => {
        controlPosition()

        const scrollParent = findScrollParent(selectBoxRef.current)

        if (scrollParent) {
            scrollParent.addEventListener("scroll", controlPosition)

            return () => {
                scrollParent.removeEventListener("scroll", controlPosition)
            }
        }
    }, [])

    const SelectboxList = () => (
        <div className="selectbox__item" style={{ top, width }}>
            <ul className="selectbox__item-list typo t15" style={style}>
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
        <div className="selectbox">
            <div
                ref={selectBoxRef}
                className={cx("selectbox__opener", { focus: isFocused && !active })}
                onClick={() => setActive(!active)}>
                <div className="typo t15">
                    {innerElement}
                    {selectedId ? items.find(item => item.id == selectedId)?.name : "-"}
                </div>
                <span className={cx("selectbox__opener-arrow", { active })} />
            </div>
            {active && <SelectboxList />}
        </div>
    )
}
