import { useRef, useState } from "react"
import useClickOutside from "@hooks/useClickOutside"
import { FormItemProp, SelectboxItemProp } from "../types"
import { useRecoilValue } from "recoil"
import { OptionAtom, UserAtom } from "@atoms/Atom"
import cx from "classnames"
import { supabase } from "@utils/superbase"
import { useInitLanguage } from "@hooks/useInitLanguage"

const ChatSetter = ({ items = [], formItem }: { items: SelectboxItemProp[]; formItem: FormItemProp }) => {
    const t = useInitLanguage()
    const selectBoxRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState<boolean>(false)

    const options = useRecoilValue(OptionAtom)
    const { id, email } = useRecoilValue(UserAtom)

    useClickOutside(selectBoxRef, () => setActive(false))

    const fetchMessages = async () => {
        // 방 생성
        const { data } = await supabase
            .from("chatroom")
            .insert([
                {
                    creator_id: id,
                    creator_email: email,
                    room_title: formItem.chat_nm,
                    chat_language: formItem.chat_lang.join(","),
                    room_option: options.display,
                    room_password: formItem.chat_pw,
                    approval_required: formItem.host_auth,
                },
            ])
            .select()

        if (data) {
            const roomId = data?.[0]?.room_id
            const params = new URLSearchParams({
                id: roomId,
                langs: formItem.chat_lang.join(","),
                display: options.display,
                host: id,
            } as {
                [key: string]: any
            })

            window.open(`/chat?${params.toString()}`, "_blank", "noopener,noreferrer")
        }
    }

    const SelectboxList = () => (
        <div className="selectbox__item">
            <ul className="selectbox__item--newchat typo t18">
                {items.map(item => (
                    <li
                        id={item.id}
                        key={item.id}
                        onClick={() => {
                            setActive(false)
                            fetchMessages()
                            //TODO 새 대화 버튼 UI 수정
                        }}>
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    )

    return (
        <div className="selectbox">
            <div
                ref={selectBoxRef}
                className="selectbox__opener--newchat"
                onClick={() => {
                    setActive(!active)
                }}>
                <div className="typo t18">
                    <div className="selector-item">
                        <span className="typo t20">{t("new_chat")}</span>
                    </div>
                </div>
                <span className={cx("selectbox__opener-arrow", { active })} />
            </div>
            {active && <SelectboxList />}
        </div>
    )
}
export default ChatSetter
