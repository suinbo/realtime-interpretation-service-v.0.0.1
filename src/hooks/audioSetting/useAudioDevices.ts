import { useTranslation } from "next-i18next"
import { useState, useEffect, useCallback } from "react"

/**
 * 오디오 장치 목록 가져오기
 * @returns audioDevices [오디오 장치 목록]
 */
export const useAudioDevices = (noAlert = false) => {
    const { t } = useTranslation()
    const [audioDevices, setAudioDevices] = useState<{ id: string; name: string }[]>([])

    const fetchAudioDevices = useCallback(async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true })
            const devices = await navigator.mediaDevices.enumerateDevices()
            const audioInputDevices = devices.filter(device => device.kind === "audioinput")
            setAudioDevices(audioInputDevices.map(({ label, deviceId }) => ({ id: deviceId, name: label })))
        } catch {
            alert(t("permission_denied"))
            setAudioDevices([])
        }
    }, [])

    useEffect(() => {
        noAlert && fetchAudioDevices()

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
