import { ChatMessageProp } from "@app/chat/types"
import { UserAtom } from "@atoms/Atom"
import { useQueryParams } from "@hooks/useQueryParams"
import { useEffect, useRef } from "react"
import { useRecoilValue } from "recoil"
import InitChat from "./InitChat"
import cx from "classnames"

/** Display 1대 (2인) */
const SingleChatMessage = ({
    msg_id,
    msg_content,
    speaker_id,
    msg_trans_content,
    msg_eng_content,
    data,
}: ChatMessageProp & { data: any }) => {
    const { id } = useRecoilValue(UserAtom)
    const { host, display } = useQueryParams()
    const buttonRefs = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (buttonRefs) {
            buttonRefs.current?.focus()
        }
    }, [])

    return (
        <li key={msg_id} className={cx("chatting__item", { my: speaker_id == id })}>
            <div className="chatting__item--user">
                <span className="profile" />
            </div>

            <div className="chatting__item--text">
                {msg_content ? (
                    <div className="text-item">
                        <div className="text-item--audio-text">
                            <span className="typo t17 w500">{id == host ? msg_content : msg_trans_content}</span>
                            <span className="trans typo t14 w400">{msg_eng_content}</span>
                        </div>
                        {display == 1 && (
                            <div className="text-item--translation-text">
                                <span className="typo t12 w500">Translation</span>
                                <p className="typo t17">{msg_trans_content}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <InitChat buttonRefs={buttonRefs} data={data} />
                )}
            </div>
        </li>
    )
}
export default SingleChatMessage
