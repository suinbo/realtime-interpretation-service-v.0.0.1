import { useState, useEffect, useCallback } from "react"

const getAudioInputDevices = async () => {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        const devices = await navigator.mediaDevices.enumerateDevices()
        return devices.filter(device => device.kind === "audioinput")
    } catch {
        alert("마이크 접근 권한이 필요합니다. 설정에서 마이크 접근을 허용해 주세요.")
        return []
    }
}

const getAudioList = async () => {
    const audioInputDevices = await getAudioInputDevices()
    return audioInputDevices.map(({ label, deviceId }) => ({ id: deviceId, name: label }))
}

/**
 * 오디오 장치 목록 가져오기
 * @returns audioDevices [오디오 장치 목록]
 */
export const useAudioDevices = () => {
    const [audioDevices, setAudioDevices] = useState<{ id: string; name: string }[]>([])

    const fetchAudioDevices = useCallback(() => {
        getAudioList()
            .then(devices => setAudioDevices(devices))
            .catch(error => console.error("Failed to fetch audio devices:", error))
    }, [])

    useEffect(() => {
        fetchAudioDevices()

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchAudioDevices()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [fetchAudioDevices])

    return audioDevices
}
