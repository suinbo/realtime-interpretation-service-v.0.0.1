import React, { SetStateAction } from "react"
import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"
import { MessageProp } from "@hooks/chatroom/useRealtimeMessage"

type RecordStatusProp = {
    [key: string]: {
        isRecording: boolean
        setIsRecording: React.Dispatch<SetStateAction<boolean>>
        isLoading: boolean
        setIsLoading: React.Dispatch<SetStateAction<boolean>>
    }
}

type mediaRefsProp = {
    [key: string]: React.RefObject<MediaRecorder | null>
}

export type ChatProp = {
    messages: MessageProp[]
    isRecording: boolean
    setIsRecording: React.Dispatch<SetStateAction<boolean>>
    isLoading: boolean
    startRecording: () => void
    stopRecording: () => void
    chatroom: ChatroomProp | null
    recordStatus: RecordStatusProp
    mediaRefs: mediaRefsProp
}

export type ChatMessageProp = {
    msg_id?: string
    msg_content?: string
    speaker_id?: string
    msg_eng_content?: string
    msg_trans_content?: string
    userId?: string
    isRecording?: boolean
    isLoading?: boolean
    startRecording?: () => void
    stopRecording?: () => void
    setIsRecording?: React.Dispatch<SetStateAction<boolean>>
    recordStatus?: RecordStatusProp
    mediaRefs?: mediaRefsProp
    buttonRefs?: React.RefObject<HTMLButtonElement>
}

export type SingleInitChatProp = {
    buttonRefs: React.RefObject<HTMLButtonElement>
    data: {
        isRecording: boolean
        isLoading: boolean
        startRecording: () => void
        stopRecording: () => void
        setIsRecording: React.Dispatch<SetStateAction<boolean>>
    }
}

export type MultiInitChatProp = {
    type: string
    recordStatus: RecordStatusProp
    mediaRefs: mediaRefsProp
}

export type ModalByApprovalProp = {
    chatroom?: ChatroomProp
    roomId?: string
}

export type PasswordInputProp = {
    setIsPassed: React.Dispatch<SetStateAction<string>>
}

export type ModalBySettingProp = {
    view: string
    setView: React.Dispatch<SetStateAction<string>>
}

export type ModalFormProp = {
    isActive: boolean
    title?: string
    formElement?: React.ReactNode
    onClose: () => void
    onSave: () => void
}

export type ModalSimpleProp = {
    isActive?: boolean
    hasTopIcon?: boolean
    text: React.ReactNode
    controller: React.ReactNode
}
