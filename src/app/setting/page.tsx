"use client"

import { optionAtom } from "@atoms/Atom"
import { useRecoilValue } from "recoil"
import LanguageView from "./_view/language/page"
import React from "react"
import DisplayView from "./_view/display/page"
import ChattingView from "./_view/chatting/page"

const SettingView = () => {
    const { view } = useRecoilValue(optionAtom)

    const optionView: { [key: string]: React.ReactNode } = {
        language: <LanguageView />,
        display: <DisplayView />,
        chatting: <ChattingView />,
    }

    return optionView[view]
}

export default SettingView
