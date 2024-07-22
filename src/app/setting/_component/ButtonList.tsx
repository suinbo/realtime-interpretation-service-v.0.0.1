"use client"

import { useRecoilState } from "recoil"
import { Button } from "@components/form"
import { optionAtom } from "@atoms/Atom"
import cx from "classnames"

const ButtonList = ({ items, content }: { items: { id: number | string; name: string }[]; content: string }) => {
    const [option, setOption] = useRecoilState(optionAtom)

    return items.map(item => {
        const { id, name } = item
        const active = option[content] == id

        return (
            <li className="content__item" key={id}>
                <Button
                    theme="checker"
                    classname={cx("typo t18", { active })}
                    onClick={() => setOption(prev => ({ ...prev, [content]: id }))}>
                    <div className="checker-item">
                        <span className={cx("checker-item-checkbox", { active })} />
                        <span>{name}</span>
                    </div>
                </Button>
            </li>
        )
    })
}

export default ButtonList
