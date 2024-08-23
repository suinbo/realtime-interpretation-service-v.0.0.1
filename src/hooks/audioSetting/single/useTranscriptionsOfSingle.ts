import { useState, useRef } from "react"
import { useAudioRecorder } from "../useAudioRecorder"

function useTranscriptionsOfSingle({
    hostId,
    userId,
    roomId,
    langCd,
    transLangCd,
    isRecording,
}: {
    hostId: string
    userId: string | null
    roomId: string
    langCd: string
    transLangCd: string
    isRecording: boolean
}) {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false) // 로딩 표시 활성화
    const [message, setMessage] = useState<string>("")
    const controlRecording = useAudioRecorder({
        hostId,
        userId,
        roomId,
        langCd,
        transLangCd,
        isRecording,
        setIsLoading,
        mediaRecorderRef,
        setMessage,
    })

    return {
        isLoading,
        message,
        setMessage,
        ...controlRecording,
    }
}

export default useTranscriptionsOfSingle
