import { useEffect } from "react"
import { useAudioDevices } from "./useAudioDevices"
import { useAudioStream } from "./useAudioStream"
import { useVolumeMeter } from "./useVolumeMeter"

/**
 * 볼륨 트랙 제어
 * @returns
 */
export const useControlVolume = (deviceId?: string) => {
    const audioDevices = useAudioDevices()
    const { audioStream, startRecording, stopRecording } = useAudioStream(deviceId)
    const { volumeBarsRef, colorVolumeMeter } = useVolumeMeter()

    useEffect(() => {
        if (audioStream) {
            const context = new AudioContext()
            const analyser = context.createAnalyser()
            const mediaStreamAudioSourceNode = context.createMediaStreamSource(audioStream)
            mediaStreamAudioSourceNode.connect(analyser)

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
                requestAnimationFrame(onFrame)
            }

            requestAnimationFrame(onFrame)
        }
    }, [audioStream, colorVolumeMeter])

    return {
        volumeBarsRef,
        audioDevices,
        startRecording,
        stopRecording,
    }
}
