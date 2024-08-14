import { useEffect, useRef } from "react"
import { useAudioDevices } from "./useAudioDevices"
import { useAudioStream } from "./useAudioStream"
import { useVolumeMeter } from "./useVolumeMeter"

/**
 * 볼륨 트랙 제어
 */
export const useControlVolume = (deviceId?: string) => {
    const audioDevices = useAudioDevices()
    const { audioStream, startRecording, stopRecording } = useAudioStream(deviceId)
    const { volumeBarsRef, colorVolumeMeter } = useVolumeMeter()
    const animationFrameId = useRef<number | null>(null)

    useEffect(() => {
        if (audioStream) {
            const context = new AudioContext()
            const analyser = context.createAnalyser()
            const mediaStreamAudioSourceNode = context.createMediaStreamSource(audioStream)
            mediaStreamAudioSourceNode.connect(analyser)

            const pcmData = new Float32Array(analyser.fftSize)

            const onFrame = () => {
                if (!audioStream) {
                    if (animationFrameId.current) {
                        cancelAnimationFrame(animationFrameId.current) // 중복 호출(메모리 누수) 방지
                        animationFrameId.current = null
                    }
                    return
                }

                analyser.getFloatTimeDomainData(pcmData)
                let sum = 0.0
                for (const amplitude of pcmData) {
                    sum += amplitude * amplitude
                }
                const rms = Math.sqrt(sum / pcmData.length)
                const normalizedVolume = Math.min(1, rms / 0.5)

                colorVolumeMeter(normalizedVolume)
                animationFrameId.current = requestAnimationFrame(onFrame)
            }

            animationFrameId.current = requestAnimationFrame(onFrame)

            return () => {
                if (animationFrameId.current) {
                    cancelAnimationFrame(animationFrameId.current)
                }
            }
        }
    }, [audioStream, colorVolumeMeter])

    return {
        volumeBarsRef,
        audioDevices,
        startRecording,
        stopRecording,
    }
}
