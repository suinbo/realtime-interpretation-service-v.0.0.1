import { useState, useEffect } from "react"

/**
 * 오디오 스트림 제어
 * @returns audioStream [오디오 스트림]
 * @returns startRecording [녹음 시작 함수]
 * @returns stopRecording [녹음 종료 함수]
 */
export const useAudioStream = (deviceId?: string) => {
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null)

    // 녹음 시작
    const startRecording = () => {
        const constraints = deviceId ? { audio: { deviceId: { exact: deviceId } } } : { audio: true }

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(stream => {
                console.log("stream:: ", stream)
                setIsRecording(true)
                setAudioStream(stream)
            })
            .catch(error => {
                console.error("마이크 권한 획득 실패", error)
            })
    }

    // 녹음 중단
    const stopRecording = () => {
        if (isRecording) {
            setIsRecording(false)
        }

        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop())
            setAudioStream(null)
        }
    }

    useEffect(() => {
        return () => {
            if (isRecording) {
                stopRecording()
            }
        }
    }, [isRecording])

    return {
        audioStream,
        startRecording,
        stopRecording,
    }
}
