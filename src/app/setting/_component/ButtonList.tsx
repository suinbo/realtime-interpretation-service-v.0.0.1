"use client"

import { useRecoilState } from "recoil"
import { Button } from "@components/form"
import { OptionAtom } from "@atoms/Atom"
import cx from "classnames"
import { useTranslation } from "next-i18next"

const ButtonList = ({ items, content }: { items: { id: number | string; name: string }[]; content: string }) => {
    const [option, setOption] = useRecoilState(OptionAtom)
    const { i18n } = useTranslation()

    return items.map(item => {
        const { id, name } = item
        const active = option[content] == id

        return (
            <li className="content__item" key={id}>
                <Button
                    theme="checker"
                    classname={cx("typo t18", { active })}
                    onClick={() => {
                        setOption(prev => ({ ...prev, [content]: id }))

                        if (content == "language") {
                            i18n.changeLanguage(id as string)
                        }
                    }}>
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
