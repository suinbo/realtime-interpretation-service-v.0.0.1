"use client"

import { useEffect, useState } from "react"
import { Button, Input } from "@components/form"
import { useQueryParams } from "@hooks/useQueryParams"
import { useTranscriptions } from "@hooks/useTranscriptions"
import Popup from "@components/Popup"
import { useRecoilValue } from "recoil"
import { UserAtom } from "@atoms/Atom"
import useRealtimeChatroom from "@hooks/chatroom/useRealtimeChatroom"
import Chatting from "./Chatting"
import PendintApproval from "./_component/PendingApproval"
import "./style.scss"
import PasswordInput from "./_component/PasswordInput"

const Chat = () => {
    const { language, display, chatting, roomId } = useQueryParams()
    // const { messages, isRecording, startRecording, stopRecording } = useTranscriptions()
    const transcriptions = useTranscriptions()
    const [start, setStart] = useState<boolean>(false)
    const user = useRecoilValue(UserAtom)

    // useEffect(() => {
    //     if (!isRecording) {
    //         startRecording()
    //     }
    // }, [isRecording, startRecording])

    const { chatroom, refetchChatroom } = useRealtimeChatroom(roomId as string, user)

    // 승인 요청 팝업
    const ApprovalModal = () => (
        <Popup hasClosedBtn={false} hasTopIcon={true} style={{ width: 430 }}>
            <div className="popup__content">
                <div className="popup__content--title">
                    <p className="typo t18">
                        <span className="typo w500">{chatroom?.member_email}</span> 님이 승인을 요청 합니다.
                    </p>
                </div>
                <div className="popup__content--btn">
                    <Button text="수락" onClick={() => ({})} classname="lined--1 typo t17 w500" />
                    <Button text="거절" onClick={() => ({})} classname="secondary typo t17 w500 " />
                </div>
            </div>
        </Popup>
    )

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

    // 암호코드 입력 모달
    const RequestPasswordModal = () => (
        <Popup hasClosedBtn={false} hasTopIcon={true} style={{ width: 430 }}>
            <div className="popup__content">
                <div className="popup__content--title">
                    <p className="typo t20">
                        대화 참여를 위해<span className="typo w600"> 암호 코드</span>를 입력하세요.
                    </p>
                </div>
                <div className="popup__content--input">
                    <PasswordInput roomId={roomId as string} refetchChatroom={refetchChatroom} />
                </div>
            </div>
        </Popup>
    )

    //console.log(chatroom)

    const Content = () => (
        <div className="content">
            <div className="content__wrapper">
                {chatroom?.member_id && Boolean(chatroom.is_approved) && (
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

    {
        /* 암호 요청 (참여자) - 계정이 참여자 and 채팅방 암호 존재 and 미승인 */
    }
    const showRequestPasswordModal =
        user.id === chatroom.member_id && chatroom.room_password && !Boolean(chatroom.is_approved)

    {
        /* 승인 요청 (참여자) - 계정이 참여자 and 승인 활성화 and 미승인 (암호 없음) */
    }
    const showPendintApproval =
        user.id === chatroom.member_id && Boolean(chatroom.approval_status) && !Boolean(chatroom.is_approved)

    {
        /* 승인 수락 요청 (생성자) - 계정이 생성자 and 승인 활성화 and 미승인 */
    }
    const showApprovalModal =
        user.id === chatroom.creator_id && Boolean(chatroom.approval_status) && !Boolean(chatroom.is_approved)

    // 모달을 제외한 콘텐츠 렌더링
    const shouldShowContent = !(showRequestPasswordModal || showPendintApproval || showApprovalModal)

    return (
        <div>
            {shouldShowContent && <Content />}
            {showRequestPasswordModal && <RequestPasswordModal />}
            {showPendintApproval && <PendintApproval />}
            {showApprovalModal && <ApprovalModal />}
        </div>
    )
}

export default Chat
