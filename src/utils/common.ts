/** 유틸 함수 */
const getAudioInputDevices = async () => {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        await navigator.mediaDevices.getUserMedia({ audio: true })
        const devices = await navigator.mediaDevices.enumerateDevices()
        return devices.filter(device => device.kind === "audioinput")
    } catch (error) {
        alert("마이크 접근 권한이 필요합니다. 설정에서 마이크 접근을 허용해 주세요.")
        return []
    }
}

export const getAudioList = async () => {
    const audioInputDevices = await getAudioInputDevices()
    return audioInputDevices.map(({ label, deviceId }) => ({ id: deviceId, name: label }))
}
