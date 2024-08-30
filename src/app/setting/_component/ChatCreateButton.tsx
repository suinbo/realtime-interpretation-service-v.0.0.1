import { OptionAtom, UserAtom } from "@atoms/Atom"
import { supabase } from "@utils/superbase"
import { useRecoilValue } from "recoil"
import { FormItemProp } from "../types"
import { useTranslation } from "next-i18next"
import { Button } from "@components/form"

/** [설정] 새 대화방 생성 버튼 */
const ChatCreateButton = ({ formItem }: { formItem: FormItemProp }) => {
    const { t } = useTranslation()
    const { id, email } = useRecoilValue(UserAtom)
    const options = useRecoilValue(OptionAtom)

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
            const params = new URLSearchParams({ id: roomId } as { [key: string]: any })

            window.open(`/chat?${params.toString()}`, "_blank", "noopener,noreferrer")
        }
    }

    return (
        <div className="setting-board__button">
            <Button
                text={<span className="new-chat typo t17">{t("new_chat")}</span>}
                classname="lined--y1"
                onClick={fetchMessages}
            />
        </div>
    )
}

export default ChatCreateButton
