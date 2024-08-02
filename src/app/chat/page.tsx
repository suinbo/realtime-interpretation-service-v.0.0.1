"use client"

import { useEffect, useState } from "react"
import { Button } from "@components/form"
import { useQueryParams } from "@hooks/useQueryParams"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { ChatroomAtom, UserAtom } from "@atoms/Atom"
import useRealtimeChatroom from "@hooks/chatroom/useRealtimeChatroom"
import Chatting from "./Chatting"
import { ModalByApprovalOfMember, ModalByApprovalOfHost } from "./_component"
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

    /** 언어셋 쿠기 존재 여부 */
    const hasCookieLangSet = cookie.hasItem("languageSet")
    const getCookiePassedStatus = cookie.getItem("is_passed")

    /** 쿠키 관리 상태 데이터 (언어셋, 암호 확인 여부) */
    const [isPassed, setIsPassed] = useState<string>(getCookiePassedStatus as string)
    const [{ langCd, transLangCd }, setLangCd] = useState<{ langCd: string; transLangCd: string }>({
        langCd: "",
        transLangCd: "",
    })

    const [originLang, transLang] = (langs as string).split(",")
    const isHost = host == user.id

    /** 언어셋 초기화 */
    const { t } = useInitLanguage(
        hasCookieLangSet ? (cookie.getItem("languageSet") as string) : isHost ? originLang : transLang
    )

    const { chatroom } = useRealtimeChatroom(id as string, user)

    /** 언어 확인 모달 활성화 */
    const [activeCheckModal, setActiveCheckModal] = useState<boolean>(false)

    //TODO: 디스플레이 1일 경우 언어셋 세팅
    const transcriptions = useTranscriptions({
        hostId: host as string,
        userId: user.id,
        roomId: id as string,
        langCd: isHost ? langCd : transLangCd,
        transLangCd: isHost ? transLangCd : langCd,
        display: display as number,
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

            setActiveCheckModal(user.id === member_id && !hasCookieLangSet)
            setStart(Boolean(is_started))

            // 언어셋 설정
            const [langCd, transLangCd] = (chat_language as any).split(",")
            setLangCd({ langCd, transLangCd })

            // 암호 통과 여부 (초기화)
            setIsPassed(getCookiePassedStatus as string)
        }
    }, [chatroom, hasCookieLangSet, isPassed])

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
        /* 암호 코드 요청 (참여자) - 계정이 참여자 and 암호 활성화 and 암호 입력 전 */
        showRequestPassword: user.id === chatroom.member_id && !!chatroom.room_password && !isPassed,

        /* 승인 요청 (참여자) - 계정이 참여자 and 승인 활성화 and 미승인 */
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
            {/* 참여자 + 생성자 (대화방 내용) */}
            {shouldShowContent && <Content />}

            {/* 참여자 */}
            {!!hasCookieLangSet && (
                <ModalByApprovalOfMember roomId={id as string} viewOption={viewOption} setIsPassed={setIsPassed} />
            )}

            {/* 생성자 */}
            {<ModalByApprovalOfHost chatroom={chatroom} roomId={id as string} viewOption={viewOption} />}

            {/* 참여자 (언어셋 체크) */}
            {activeCheckModal && <ModalByLanguage setActive={setActiveCheckModal} />}
        </div>
    )
}

export default Chat
