"use client"

import React from "react"
import { RecoilRoot } from "recoil"

export default function Provider({ children }: { children: React.ReactElement }) {
    return <RecoilRoot>{children}</RecoilRoot>
}
