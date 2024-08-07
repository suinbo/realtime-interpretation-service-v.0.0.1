import { SetStateAction } from "react"
import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"

export type ChatMessageProp = {
    msg_id: string
    msg_content: string
    speaker_id: string
    msg_eng_content: string
    msg_trans_content: string
    userId: string
    isRecording: boolean
    isLoading: boolean
    startRecording: () => void
    stopRecording: () => void
    setIsRecording: React.Dispatch<SetStateAction<boolean>>
    recordStatus: {
        [key: string]: {
            isRecording: boolean
            setIsRecording: React.Dispatch<SetStateAction<boolean>>
            isLoading: boolean
            setIsLoading: React.Dispatch<SetStateAction<boolean>>
        }
    }
    mediaRefs: {
        [key: string]: any
    }
}

export type InitChatProp = {
    type: string
    recordStatus: {
        [key: string]: {
            isRecording: boolean
            setIsRecording: React.Dispatch<SetStateAction<boolean>>
            isLoading: boolean
            setIsLoading: React.Dispatch<SetStateAction<boolean>>
        }
    }
    mediaRefs: {
        [key: string]: any
    }
}

export type ModalByApprovalProp = {
    chatroom: ChatroomProp
    roomId: string
    viewOption: { [key: string]: boolean }
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
