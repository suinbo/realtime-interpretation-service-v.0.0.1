"use client"

import { useEffect, useState } from "react"
import { Button } from "@components/form"
import { useQueryParams } from "@hooks/useQueryParams"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { ChatroomAtom, UserAtom } from "@atoms/Atom"
import useRealtimeChatroom from "@hooks/chatroom/useRealtimeChatroom"
import Chatting from "./Chatting"
import { ModalByApproval } from "./_component"
import { useTranscriptions } from "@hooks/audioSetting/useTranscriptions"
import "@assets/styles/common.scss"
import "./style.scss"

const Chat = () => {
    const { id, langs, display, host } = useQueryParams()
    const [start, setStart] = useState<boolean>(false)

    const user = useRecoilValue(UserAtom)
    const setChatroom = useSetRecoilState(ChatroomAtom)

    const transLanguage: { [key: string]: string } = {
        ko: "Korean",
        en: "English",
    }

    const { chatroom } = useRealtimeChatroom(id as string, user)

    // 디스플레이 1 : 두 언어 보여야 함 (langCd, transLangCd)
    // 디스플레이 2 : 자기언어만 보이면 됨 (langCd) /
    // 호스트면 말하는 음성: (langs as string).split(",")[0] 아니면 (langs as string).split(",")[1]
    // 호스트 번역 : transLanguage[(langs as string).split(",")[1]] 아니면 transLanguage[(langs as string).split(",")[0]]
    const transcriptions = useTranscriptions({
        hostId: host as string,
        userId: user.id,
        roomId: id as string,
        //말하는 언어
        langCd:
            display == 1
                ? (langs as string).split(",")[0]
                : user.id == host
                ? (langs as string).split(",")[0]
                : (langs as string).split(",")[1],
        //번역 언어
        transLangCd:
            display == 1
                ? transLanguage[(langs as string).split(",")[1]]
                : user.id == host
                ? transLanguage[(langs as string).split(",")[1]]
                : transLanguage[(langs as string).split(",")[0]],
    })

    useEffect(() => {
        if (chatroom) {
            const { room_title, chat_language, room_password, room_option, approval_required, expired_at, creator_id } =
                chatroom

            setChatroom({
                chat_nm: room_title,
                chat_lang: chat_language,
                chat_pw: room_password,
                has_chat_pw: !!room_password,
                host_auth: approval_required,
                room_option,
            })
        }
    }, [chatroom])

    const Content = () => (
        <div className="content">
            <div className="content__wrapper">
                {start ? (
                    <Chatting {...transcriptions} userId={user.id} chatroom={chatroom} />
                ) : (
                    <div className="content__body--button">
                        <Button
                            text="시작하기"
                            onClick={() => {
                                setStart(!start)
                                //transcriptions.startRecording()
                            }}
                            classname="typo t38 w500"
                            theme="lined--2"
                        />
                    </div>
                )}
            </div>
        </div>
    )

    if (!chatroom) return

    const isAccepted = Boolean(chatroom.approval_accepted)
    const isRequired = Boolean(chatroom.approval_required)
    const isRequested = Boolean(chatroom.approval_requested)
    const isExpired = !!chatroom.expired_at

    const viewOption = {
        showRequestPassword: user.id === chatroom.member_id && !!chatroom.room_password && !isAccepted,

        /* 승인 요청 (참여자) - 계정이 참여자 and 승인 활성화 and 미승인 (암호 없음) */
        showRequestApproval: user.id === chatroom.member_id && isRequired && !isRequested && !isAccepted,

        /* 승인 수락 요청 (생성자) - 계정이 생성자 and 승인 활성화 and 미승인 */
        showResponseApproval: user.id === chatroom.creator_id && isRequired && !isAccepted && isRequested,

        /* 승인 수락 요청 대기 (참여자) - 계정이 참여자 and 승인 요청 and 미승인 */
        showPendingApproval: user.id === chatroom.member_id && isRequired && isRequested && !isAccepted,

        showInvalidRoom: isExpired,
    }

    // 모달을 제외한 콘텐츠 렌더링
    const shouldShowContent = !Object.values(viewOption).some(Boolean)

    return (
        <div>
            {shouldShowContent && <Content />}
            <ModalByApproval chatroom={chatroom} roomId={id as string} viewOption={viewOption} />
        </div>
    )
}

export default Chat
