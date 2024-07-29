"use client"

import { useEffect, useState } from "react"
import { Button } from "@components/form"
import { useQueryParams } from "@hooks/useQueryParams"
import { useTranscriptions } from "@hooks/useTranscriptions"
import Popup from "@components/Popup"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { ChatroomAtom, UserAtom } from "@atoms/Atom"
import useRealtimeChatroom from "@hooks/chatroom/useRealtimeChatroom"
import Chatting from "./Chatting"
import { ModalByApproval } from "./_component"
import "./style.scss"

const Chat = () => {
    const { id } = useQueryParams()
    const transcriptions = useTranscriptions()
    const [start, setStart] = useState<boolean>(false)

    const user = useRecoilValue(UserAtom)
    const setChatroom = useSetRecoilState(ChatroomAtom)

    const { chatroom } = useRealtimeChatroom(id as string, user)

    useEffect(() => {
        if (chatroom) {
            const { room_title, chat_language, room_password, room_option, approval_required } = chatroom

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

    // 유효하지 않은 링크 팝업
    const InvalidModal = () => (
        <Popup hasClosedBtn={false} hasTopIcon={true} style={{ width: 430 }}>
            <div className="popup__content">
                <div className="popup__content--title">
                    <p className="typo t18">
                        <span className="typo w500">유효하지 않은</span> 링크 입니다.
                    </p>
                </div>
                <div className="popup__content--btn">
                    <Button text="창 닫기" onClick={() => ({})} classname="secondary typo t17 w500" />
                </div>
            </div>
        </Popup>
    )

    const Content = () => (
        <div className="content">
            <div className="content__wrapper">
                {isAccepted && (
                    <div className="content__body--no-member typo t18 ">
                        {`${chatroom?.member_email} 님이 참여하였습니다.`}
                    </div>
                )}
                {start ? (
                    <Chatting {...transcriptions} />
                ) : (
                    <div className="content__body--button">
                        <Button
                            text="시작하기"
                            onClick={() => {
                                setStart(!start)
                                transcriptions.startRecording()
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

    const viewOption = {
        showRequestPassword: user.id === chatroom.member_id && !!chatroom.room_password && !isAccepted,

        /* 승인 요청 (참여자) - 계정이 참여자 and 승인 활성화 and 미승인 (암호 없음) */
        showRequestApproval: user.id === chatroom.member_id && isRequired && !isRequested && !isAccepted,

        /* 승인 수락 요청 (생성자) - 계정이 생성자 and 승인 활성화 and 미승인 */
        showResponseApproval: user.id === chatroom.creator_id && isRequired && !isAccepted && isRequested,

        /* 승인 수락 요청 대기 (참여자) - 계정이 참여자 and 승인 요청 and 미승인 */
        showPendingApproval: user.id === chatroom.member_id && isRequired && isRequested && !isAccepted,
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
