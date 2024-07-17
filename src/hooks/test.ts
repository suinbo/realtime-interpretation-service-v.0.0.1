import { getAudioInputDevices } from "@utils/common"
import { RefObject, useState } from "react"

export const useControlVolume = (volumeBarsRef: RefObject<HTMLDivElement>[]) => {
    let isRecording = false
    let audioStream: MediaStream | null = null
    let onFrameId: number | null = null
    const [currentDevice, setCurrentDevice] = useState<{ id: string; name: string } | null>(null)

    const startRecording = () => {
        /**
         * 마이크 권한을 요청 (Web API)
         * @return stream 미디어 객체를 표현 (비디오/오디오)
         */
        navigator.mediaDevices
            .getUserMedia({ audio: true }) // 마이크 권한을 요청 (Web API)
            .then(stream => {
                isRecording = true
                audioStream = stream

                /**
                 * 입력된 오디오 볼륨 정규화
                 * @description 0 ~ 1 사이 값으로 정규화
                 */

                const context = new AudioContext() // AudioContext 생성 (Web Audio API)
                const analyser = context.createAnalyser() // 오디오 신호를 분석
                const mediaStreamAudioSourceNode = context.createMediaStreamSource(stream) // 미디어 스트림을 AudioContext 내에서 사용할 수 있는 형식으로 변환
                mediaStreamAudioSourceNode.connect(analyser, 0) // 변환된 미디어 스트림을 AnalyserNode 객체에 연결(단일 채널)
                const pcmData = new Float32Array(analyser.fftSize) // 오디오 데이터를 저장할 버퍼

                // 현재 사용 중인 오디오 입력 장치를 식별
                identifyCurrentAudioInputDevice(stream)

                // 볼륨값 계산 (실시간 오디오 데이터 얻어옴)
                const onFrame = () => {
                    analyser.getFloatTimeDomainData(pcmData) // 현재시간의 오디오 데이터 가져와 버퍼(배열)에 저장

                    let sum = 0.0
                    for (const amplitude of pcmData) {
                        // amplitude: 각 오디오의 진폭
                        sum += amplitude * amplitude // 음의 값, 양의 값(진폭)
                    }

                    const rms = Math.sqrt(sum / pcmData.length) // 제곱된 값의 평균 구한후 제곱근 씌워 [오디오 신호 평균 에너지, 볼륨 크기]

                    const normalizedVolume = Math.min(1, rms / 0.5) // RMS 값을 0 ~ 1 사이 실수로 정규화

                    colorVolumeMeter(normalizedVolume) // 시각화하는 함수에 전달
                    onFrameId = window.requestAnimationFrame(onFrame) // 재귀적으로 자신 호출하여 반복
                }

                onFrameId = window.requestAnimationFrame(onFrame)
            })
            .catch(error => {
                console.error("마이크 권한 획득 실패", error)
            })
    }

    const stopRecording = () => {
        if (isRecording) {
            isRecording = false
            if (onFrameId) window.cancelAnimationFrame(onFrameId)
        }

        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop())
        }
    }

    // 0~1 사이의 실수값으로 전달받은 볼륨을 0~10의 정수로 변환하여
    // 변환한 정수만큼 div 태그를 색칠

    /**
     * 볼륨 값 정수로 정규화
     * @param volume 0 ~ 1 사이의 실수
     * @param min 정수
     * @param max 정수
     * @returns
     */
    const normalizeToInteger = (volume: number, min: number, max: number) => {
        const scaledValue = Math.min(max, Math.max(min, volume * (max - min) + min))
        return Math.round(scaledValue)
    }

    /**
     * 볼륨 시각화
     * @param volume 0 ~ 1 사이의 실수
     */
    const colorVolumeMeter = (volume: number) => {
        const VOL_METER_MAX = 30

        // 볼륨바 배경 색상 채우기
        volumeBarsRef.forEach(ref => {
            if (ref.current) {
                ref.current.style.backgroundColor = "#e6e6e6"
            }
        })

        const numberOfChildToColor = normalizeToInteger(volume, 0, VOL_METER_MAX) // 실수값으로 전달받은 볼륨을 0 ~ 10 의 정수로 변환
        const coloredChild = volumeBarsRef.slice(0, numberOfChildToColor) // 색칠할 볼륨 바

        coloredChild.forEach(ref => {
            if (ref.current) {
                ref.current.style.backgroundColor = "#ffd84f"
            }
        })
    }

    /**
     * 현재 입력받고 있는 오디오 장치
     * @param stream
     */
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

    return { currentDevice, startRecording, stopRecording }
}
