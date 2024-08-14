"use client"

import { useEffect, useState } from "react"
import { Button } from "@components/form"
import { useQueryParams } from "@hooks/useQueryParams"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { ChatroomAtom, UserAtom } from "@atoms/Atom"
import useRealtimeChatroom from "@hooks/chatroom/useRealtimeChatroom"
import Chatting from "./Chatting"
import { ModalByApprovalOfMember, ModalByApprovalOfHost } from "./_component"
import ModalByLanguage from "./_component/modal/ModalByLanguage"
import { supabase } from "@utils/superbase"
import useRealtimeMessage from "@hooks/chatroom/useRealtimeMessage"
import { useMultiRecording } from "./_hook/useMultiRecording"
import { useSingleRecording } from "./_hook/useSingleRecording"
import { useTranslation } from "next-i18next"
import { useView } from "./_hook/useView"
import { useAudioDevices } from "@hooks/audioSetting/useAudioDevices"
import { useFontClass } from "@hooks/useInitFontClass"
import "@assets/styles/common.scss"
import "./style.scss"

const Chat = () => {
    const { id } = useQueryParams()
    const user = useRecoilValue(UserAtom)
    const setChatroom = useSetRecoilState(ChatroomAtom)
    const [start, setStart] = useState<boolean>(false)
    const { t } = useTranslation()
    const fontClass = useFontClass()

    /** 실시간 구독 데이터 */
    const { chatroom, isInvalidRoom } = useRealtimeChatroom(id as string, user)
    const { messages } = useRealtimeMessage({ roomId: id as string })

    /** 상태 (display 1 - multi) */
    const { mediaRefs, recordStatus } = useMultiRecording()

    /** 상태 (display 2 - single) */
    const { isRecording, setIsRecording, langCd, setLangCd, transcriptions, hasCookieLangSet } =
        useSingleRecording(chatroom)

    /** 언어 확인 모달 활성화 */
    const [activeCheckModal, setActiveCheckModal] = useState<boolean>(false)

    /** 요청/응답 모달 활성화 */
    const { view, setView, setIsPassed } = useView(chatroom, user.id)

    /** 오디오 장치 리스트(권한 검사) */
    const audioDevices = useAudioDevices()

    useEffect(() => {
        if (chatroom) {
            const { chat_language, member_id, is_started, expired_at } = chatroom

            setChatroom(chatroom)
            setActiveCheckModal(user.id === member_id && !hasCookieLangSet && !expired_at)
            setStart(Boolean(is_started))

            // 언어셋 설정
            const [langCd, transLangCd] = (chat_language as any).split(",")
            setLangCd({ langCd, transLangCd })
        }

        if (isInvalidRoom) setView("invalidRoom")
    }, [chatroom, hasCookieLangSet])

    const Content = () => (
        <div className="content">
            <div className="content__wrapper">
                {start ? (
                    <Chatting
                        recordStatus={recordStatus}
                        mediaRefs={mediaRefs}
                        chatroom={chatroom}
                        langCd={langCd}
                        messages={messages}
                        data={{ isRecording, setIsRecording, ...transcriptions }}
                    />
                ) : (
                    <div className="content__body--button">
                        <Button
                            text={t("do_start")}
                            onClick={async () => {
                                if (!audioDevices.length) alert(t("permission_denied"))
                                else {
                                    setStart(!start)
                                    await supabase
                                        .from("chatroom")
                                        .update({
                                            is_started: 1,
                                        })
                                        .eq("room_id", id)
                                        .select("*")
                                }
                            }}
                            classname="typo t38 w500"
                            theme="lined--2"
                        />
                    </div>
                )}
            </div>
        </div>
    )

    if (isInvalidRoom) return <ModalByApprovalOfHost view={view} setView={setView} />

    if (!chatroom) return

    return (
        <div className={fontClass}>
            {/* 참여자 + 생성자 (대화방 내용) */}
            {!view && <Content />}

            {/* 생성자 */}
            {<ModalByApprovalOfHost chatroom={chatroom} roomId={id as string} view={view} setView={setView} />}

            {/* 참여자 (언어셋 설정 전) */}
            {activeCheckModal && <ModalByLanguage setActive={setActiveCheckModal} langCd={langCd} />}

            {/* 참여자 (언어셋 설정 후) */}
            {!!hasCookieLangSet && (
                <ModalByApprovalOfMember
                    roomId={id as string}
                    view={view}
                    setView={setView}
                    setIsPassed={setIsPassed}
                />
            )}
        </div>
    )
}

export default Chat
