import React, { SetStateAction } from "react"
import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"
import { MessageProp } from "@hooks/chatroom/useRealtimeMessage"

type RecordStatusDetails = {
    isRecording: boolean
    setIsRecording: React.Dispatch<React.SetStateAction<boolean>>
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export type RecordStatusProp = {
    [key: string]: any
    my: RecordStatusDetails
    your: RecordStatusDetails
    message: string
    setMessage: React.Dispatch<SetStateAction<string>>
}

type mediaRefsProp = {
    [key: string]: React.RefObject<MediaRecorder | null>
}

export type ChatProp = {
    messages: MessageProp[]
    langCd: { langCd: string; transLangCd: string }
    data: any
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

export type ChattingDataProp = {
    data: {
        isRecording: boolean
        isLoading: boolean
        startRecording: () => void
        stopRecording: () => void
        setIsRecording: React.Dispatch<SetStateAction<boolean>>
    }
}

export type SingleInitChatProp = {
    buttonRefs: React.RefObject<HTMLButtonElement>
} & ChattingDataProp

export type MultiInitChatProp = {
    messages?: MessageProp[]
    langCd: { langCd: string; transLangCd: string }
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

export type ModalInputCheckProp = {
    isActive: boolean
    title: string
    formElement?: React.ReactNode
    onClose?: () => void
}

export type ModalNoticeProp = {
    isActive: boolean
    title: string
    subtitle: string
    formElement?: React.ReactNode
    onClose?: () => void
}

export type ModalCustomProp = {
    isActive: boolean
    formElement?: React.ReactNode
    titleElement: React.ReactNode
    onClose?: () => void
}
