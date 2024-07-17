"use client"

import { useRecoilState } from "recoil"
import cx from "classnames"
import { Button } from "@components/form"
import { optionAtom } from "@atoms/Atom"

const ButtonList = ({ items, content }: { items: { id: number | string; value: string }[]; content: string }) => {
    const [option, setOption] = useRecoilState(optionAtom)

    return items.map(item => {
        const { id, value } = item
        const active = option[content] == id

        return (
            <li className="content__item" key={value}>
                <Button
                    theme="checker"
                    classname={cx("typo t18", { active })}
                    onClick={() => setOption(prev => ({ ...prev, [content]: id }))}>
                    <div className="checker-item">
                        <span className={cx("checker-item-checkbox", { active })} />
                        <span>{value}</span>
                    </div>
                </Button>
            </li>
        )
    })
}

export default ButtonList
