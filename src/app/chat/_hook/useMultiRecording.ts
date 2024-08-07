import { useRef, useState } from "react"

/** 상태 관리 훅 */
export const useMultiRecording = () => {
    // isRecording 상태
    const [myIsRecording, setMyIsRecording] = useState<boolean>(false)
    const [yourIsRecording, setYourIsRecording] = useState<boolean>(false)

    // isLoading 상태
    const [isMyLoading, setIsMyLoading] = useState<boolean>(false)
    const [isYourLoading, setIsYourLoading] = useState<boolean>(false)

    const recordStatus = {
        my: {
            isRecording: myIsRecording,
            setIsRecording: setMyIsRecording,
            isLoading: isMyLoading,
            setIsLoading: setIsMyLoading,
        },
        your: {
            isRecording: yourIsRecording,
            setIsRecording: setYourIsRecording,
            isLoading: isYourLoading,
            setIsLoading: setIsYourLoading,
        },
    }

    // MediaRecorder reference
    const mediaRefs = {
        my: useRef<MediaRecorder | null>(null),
        your: useRef<MediaRecorder | null>(null),
    }

    return {
        recordStatus,
        mediaRefs,
    }
}
