import { getAudioInputDevices } from "@utils/common"
import { RefObject, useEffect, useState } from "react"

export const useControlVolume = (volumeBarsRef: RefObject<HTMLDivElement>[]) => {
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
    const [currentDevice, setCurrentDevice] = useState<{ id: string; name: string } | null>(null)
    let onFrameId: number | null = null

    const startRecording = () => {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(stream => {
                setIsRecording(true)
                setAudioStream(stream)

                const context = new AudioContext()
                const analyser = context.createAnalyser()
                const mediaStreamAudioSourceNode = context.createMediaStreamSource(stream)
                mediaStreamAudioSourceNode.connect(analyser)

                identifyCurrentAudioInputDevice(stream)

                const pcmData = new Float32Array(analyser.fftSize)

                const onFrame = () => {
                    analyser.getFloatTimeDomainData(pcmData)

                    let sum = 0.0
                    for (const amplitude of pcmData) {
                        sum += amplitude * amplitude
                    }

                    const rms = Math.sqrt(sum / pcmData.length)
                    const normalizedVolume = Math.min(1, rms / 0.5)

                    colorVolumeMeter(normalizedVolume)
                    onFrameId = requestAnimationFrame(onFrame)
                }

                onFrameId = requestAnimationFrame(onFrame)
            })
            .catch(error => {
                console.error("마이크 권한 획득 실패", error)
            })
    }

    const stopRecording = () => {
        if (isRecording) {
            setIsRecording(false)
            if (onFrameId) cancelAnimationFrame(onFrameId)
        }

        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop())
            setAudioStream(null)
        }
    }

    const normalizeToInteger = (volume: number, min: number, max: number) => {
        const scaledValue = Math.min(max, Math.max(min, volume * (max - min) + min))
        return Math.round(scaledValue)
    }

    const colorVolumeMeter = (volume: number) => {
        const VOL_METER_MAX = 30

        volumeBarsRef.forEach(ref => {
            if (ref.current) {
                ref.current.style.backgroundColor = "#e6e6e6"
            }
        })

        const numberOfChildToColor = normalizeToInteger(volume, 0, VOL_METER_MAX)
        const coloredChild = volumeBarsRef.slice(0, numberOfChildToColor)

        coloredChild.forEach(ref => {
            if (ref.current) {
                ref.current.style.backgroundColor = "#ffd84f"
            }
        })
    }

    const identifyCurrentAudioInputDevice = async (stream: MediaStream) => {
        const audioTracks = stream.getAudioTracks()
        if (audioTracks.length > 0) {
            const settings = audioTracks[0].getSettings()
            const currentDeviceId = settings.deviceId

            if (currentDeviceId) {
                const audioInputDevices = await getAudioInputDevices()
                const currentDeviceInfo = audioInputDevices.find(device => device.deviceId === currentDeviceId)

                if (currentDeviceInfo) {
                    setCurrentDevice({ id: currentDeviceInfo.deviceId, name: currentDeviceInfo.label })
                }
            }
        }
    }

    useEffect(() => {
        return () => {
            if (isRecording) {
                stopRecording()
            }
        }
    }, [])

    return { currentDevice, startRecording, stopRecording }
}
