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

    const [requestApproval, setRequestApproval] = useState<boolean>(false) // 참여자 승인 요청 (true: 승인 요청, false: 승인 요청 없음)

    // useEffect(() => {
    //     if (!isRecording) {
    //         startRecording()
    //     }
    // }, [isRecording, startRecording])

    const { chatroom } = useRealtimeChatroom(roomId as string, user)

    // 채팅방 접근 시 user.id 와 creator_id 가 같을때 생성자, 다를때 참여자 보여주는 팝업 다름

    // member_id 가 null 이면 참여자가 없습니다
    // 해당 링크로 접속후 암호 입력하면 member_id 에 해당 유저의 id insert
    // member_id 가 null 이 아닐시 (해당 링크 접속하여 암호 통과했다는 뜻이므로) 승인 요청 팝업 노출
    // table 에 room_password 도 추가 (null 일시, 공개방)

    // member_id 가 null이 아니면 참여자 ooo 가 입장했습니다.

    // 승인 요청 팝업
    const ApprovalModal = () => (
        <Popup hasClosedBtn={false} hasTopIcon={true} style={{ width: 412 }}>
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
        <Popup hasClosedBtn={false} hasTopIcon={true} style={{ width: 412 }}>
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
        <Popup hasClosedBtn={false} hasTopIcon={true} style={{ width: 412 }}>
            <div className="popup__content">
                <div className="popup__content--title">
                    <p className="typo t20">
                        대화 참여를 위해<span className="typo w600"> 암호 코드</span>를 입력하세요.
                    </p>
                </div>
                <div className="popup__content--input">
                    <PasswordInput roomId={roomId as string} />
                </div>
            </div>
        </Popup>
    )

    //console.log(chatroom)
    // console.log(chatroom)

    if (!chatroom) return

    return (
        <>
            <div className="content">
                <div className="content__wrapper">
                    <div className="content__body--no-member typo t18 ">
                        {chatroom?.member_id ? `${chatroom?.member_email} 님이 참여하였습니다.` : "참여자가 없습니다."}
                    </div>
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

            {/* 암호 요청 (참여자) */}
            {chatroom.room_password && !Boolean(chatroom.is_approved) && <RequestPasswordModal />}

            {/* 승인 요청 (참여자) - 승인 활성화 and 미승인 */}
            {Boolean(chatroom.approval_status) && !Boolean(chatroom.is_approved) && <PendintApproval />}
        </>
    )
}

export default Chat
