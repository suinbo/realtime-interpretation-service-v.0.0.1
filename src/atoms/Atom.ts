import { atom } from "recoil"

/** 화면 옵션 */
type OptionProp = {
    [key: string]: string | number
    language: string
    display: number
}
export const optionAtom = atom({
    key: "optionAtom",
    default: {
        language: "Afrikaans",
        display: 0,
    } as OptionProp,
})
