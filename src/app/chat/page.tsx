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
import { useInitLanguage } from "@hooks/useInitLanguage"
import ModalByLanguage from "./_component/modal/ModalByLanguage"
import { supabase } from "@utils/superbase"
import cookie from "@utils/cookie"
import "@assets/styles/common.scss"
import "./style.scss"

const Chat = () => {
    const { id, langs, display, host } = useQueryParams()
    const user = useRecoilValue(UserAtom)
    const setChatroom = useSetRecoilState(ChatroomAtom)
    const [start, setStart] = useState<boolean>(false)

    const [originLang, transLang] = (langs as string).split(",")
    const isHost = host == user.id

    /** 언어셋 쿠기 존재 여부 */
    const hasCookie = cookie.hasItem("languageSet")

    /** 언어셋 초기화 */
    const { t } = useInitLanguage(
        hasCookie ? (cookie.getItem("languageSet") as string) : isHost ? originLang : transLang
    )

    const { chatroom } = useRealtimeChatroom(id as string, user)

    /** 언어 확인 모달 활성화 */
    const [activeCheckModal, setActiveCheckModal] = useState<boolean>(false)

    const transcriptions = useTranscriptions({
        hostId: host as string,
        userId: user.id,
        roomId: id as string,
        //말하는 언어
        langCd: display == 1 ? originLang : isHost ? originLang : transLang,
        //번역 언어
        transLangCd: display == 1 ? transLang : isHost ? transLang : originLang,
    })

    useEffect(() => {
        if (chatroom) {
            const {
                room_title,
                chat_language,
                room_password,
                room_option,
                approval_required,
                approval_accepted,
                member_id,
                expired_at,
                creator_id,
                is_started,
            } = chatroom

            setChatroom({
                chat_nm: room_title,
                chat_lang: chat_language,
                chat_pw: room_password,
                has_chat_pw: !!room_password,
                host_auth: approval_required,
                room_option,
            })

            setActiveCheckModal(user.id === member_id && !hasCookie)
            setStart(Boolean(is_started))
        }
    }, [chatroom, hasCookie])

    const Content = () => (
        <div className="content">
            <div className="content__wrapper">
                {start ? (
                    <Chatting {...transcriptions} userId={user.id} chatroom={chatroom} />
                ) : (
                    <div className="content__body--button">
                        <Button
                            text={t("do_start")}
                            onClick={async () => {
                                setStart(!start)
                                await supabase
                                    .from("chatroom")
                                    .update({
                                        is_started: 1,
                                    })
                                    .eq("room_id", id)
                                    .select("*")
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

    // 모달을 제외한 콘텐츠 렌더링 (참여자)
    // 생성자에게는 [시작하기] 버튼 항상 노출
    const shouldShowContent = !Object.values(viewOption).some(Boolean)

    return (
        <div>
            {shouldShowContent && <Content />}
            {!!hasCookie && <ModalByApproval chatroom={chatroom} roomId={id as string} viewOption={viewOption} />}
            {activeCheckModal && <ModalByLanguage setActive={setActiveCheckModal} />}
        </div>
    )
}

export default Chat
