"use client"

import cx from "classnames"
import { useSetRecoilState } from "recoil"
import { OptionAtom } from "@atoms/Atom"
import { ViewProp } from "../types"
import "./style.scss"

/** 옵션 화면 이동 네비게이터 */
const Navigation = ({ view, position }: { view: ViewProp; position: string }) => {
    const setOption = useSetRecoilState(OptionAtom)
    return <div className={cx("navigation", position)} onClick={() => setOption(prev => ({ ...prev, view }))} />
}

export default Navigation
