"use client"

import React from "react"
import { OptionAtom } from "@atoms/Atom"
import { useRecoilValue } from "recoil"
import { Language, Display, Chatting } from "./_view"
import "./style.scss"

const SettingView = () => {
    const { view } = useRecoilValue(OptionAtom)

    const optionView: { [key: string]: React.ReactNode } = {
        language: <Language />,
        display: <Display />,
        chatting: <Chatting />,
    }

    return optionView[view]
}

export default SettingView
