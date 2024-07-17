import { useControlVolume } from "@hooks/useControlVolume"
import { useEffect, useRef, useState } from "react"
import "./style.scss"
import { Button } from "@components/form"

const VolumeTester = ({
    volumeBarsRef,
    data: { currentDevice, startRecording, stopRecording },
}: {
    volumeBarsRef: any[]
    data: {
        currentDevice: any
        startRecording: () => void
        stopRecording: () => void
    }
}) => {
    const [active, setActive] = useState<boolean>(false)
    //const volumeBarsRef = Array.from({ length: 30 }, () => useRef<HTMLDivElement>(null))

    //const { currentDevice, startRecording, stopRecording } = useControlVolume(volumeBarsRef)

    //console.log("currentDevice:: ", currentDevice)

    //TODO 버튼이 없을때 화면 이동시 자동으로 오디오 감지 종료
    // useEffect(() => {
    //     startRecording()
    //     return () => {
    //         stopRecording()
    //     }
    // }, [startRecording, stopRecording])

    const [recording, setRecording] = useState<boolean>(false)

    const handleToggleRecording = () => {
        if (recording) stopRecording()
        else startRecording()

        setRecording(!recording)
    }
    return (
        <>
            <div className="volumebar-tester">
                <Button
                    text={`테스트 ${recording ? "종료" : "시작"}`}
                    classname="test-button"
                    onClick={handleToggleRecording}
                />
            </div>
            <div className="volumebar-tester__item">
                <span className="volumebar-tester__item--icon" />
                <div className="volumebar-tester__item--bar">
                    {volumeBarsRef.map((ref, index) => (
                        <div key={index} ref={ref} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default VolumeTester
