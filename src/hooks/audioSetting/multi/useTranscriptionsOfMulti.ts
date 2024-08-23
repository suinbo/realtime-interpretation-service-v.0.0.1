import { SetStateAction } from "react"
import { useAudioRecorder } from "../useAudioRecorder"

function useTranscriptionsOfMulti({
    hostId,
    userId,
    roomId,
    langCd,
    transLangCd,
    isRecording,
    mediaRecorderRef,
    setIsLoading,
    setMessage,
}: {
    hostId: string
    userId: string | null
    roomId: string
    langCd: string
    transLangCd: string
    isRecording: boolean
    mediaRecorderRef: React.RefObject<MediaRecorder | null>
    setIsLoading: React.Dispatch<SetStateAction<boolean>>
    setMessage: React.Dispatch<SetStateAction<string>>
}) {
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

    return controlRecording
}

export default useTranscriptionsOfMulti
