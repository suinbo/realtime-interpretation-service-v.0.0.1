import { useEffect, useRef, useState } from "react"
import useClickOutside from "@hooks/useClickOutside"
import { SelectboxItemProp } from "../types"
import { useRecoilValue } from "recoil"
import { optionAtom, UserAtom } from "@atoms/Atom"
import cx from "classnames"
import { supabase } from "@utils/superbase"

const ChatSetter = ({ items = [] }: { items: SelectboxItemProp[] }) => {
    const selectBoxRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState<boolean>(false)

    const options = useRecoilValue(optionAtom)
    const { id } = useRecoilValue(UserAtom)

    useClickOutside(selectBoxRef, () => setActive(false))

    useEffect(() => {
        // 채널 생성
        const channel = supabase
            .channel("realtime:chatroom")
            .on("postgres_changes", { event: "*", schema: "public", table: "chatroom" }, payload => {
                console.log("Change received!", payload)
            })
            .subscribe()

        // 컴포넌트가 언마운트될 때 구독 해제
        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchMessages = async () => {
        // 방 생성
        const { data } = await supabase
            .from("chatroom")
            .insert([
                {
                    creator_id: id,
                    member_id: null,
                },
            ])
            .select()

        if (data) {
            const roomId = data?.[0]?.room_id
            const params = new URLSearchParams({ ...options, roomId } as { [key: string]: any })

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
            <div ref={selectBoxRef} className="selectbox__opener--newchat" onClick={() => setActive(!active)}>
                <div className="typo t18">
                    <div className="selector-item">
                        <span className="typo t20">새 대화</span>
                    </div>
                </div>
                <span className={cx("selectbox__opener-arrow", { active })} />
            </div>
            {active && <SelectboxList />}
        </div>
    )
}
export default ChatSetter
