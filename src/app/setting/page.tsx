"use client"

import React from "react"
import { optionAtom } from "@atoms/Atom"
import { useRecoilValue } from "recoil"
import { Language, Display, Chatting } from "./_view"

const SettingView = () => {
    const { view } = useRecoilValue(optionAtom)

    const optionView: { [key: string]: React.ReactNode } = {
        language: <Language />,
        display: <Display />,
        chatting: <Chatting />,
    }

    return optionView[view]
}

export default SettingView
