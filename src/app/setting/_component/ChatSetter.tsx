import { useRef, useState } from "react"
import cx from "classnames"
import useClickOutside from "@hooks/useClickOutside"
import { SelectboxItemProp } from "../types"

const ChatSetter = ({ items = [] }: { items: SelectboxItemProp[] }) => {
    const selectBoxRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState<boolean>(false)

    useClickOutside(selectBoxRef, () => setActive(false))

    const SelectboxList = () => (
        <div className="selectbox__item">
            <ul className="selectbox__item--newchat typo t18">
                {items.map(item => (
                    <li
                        id={item.id}
                        key={item.id}
                        onClick={() => {
                            setActive(false)
                            //TODO 새 대화 버튼 UI 수정
                            window.open("/chat", "_blank", "noopener,noreferrer")
                        }}>
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    )

    return (
        <div className="selectbox">
            <div ref={selectBoxRef} className="selectbox__opener--newchat" onClick={() => setActive(!active)}>
                <div className="typo t18">
                    <div className="selector-item">
                        <span className="typo t20">새 대화</span>
                    </div>
                </div>
                <span className={cx("selectbox__opener-arrow", { active })} />
            </div>
            {active && <SelectboxList />}
        </div>
    )
}
export default ChatSetter
