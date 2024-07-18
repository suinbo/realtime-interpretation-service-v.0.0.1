import { RefObject, useState } from "react"
import { Button } from "@components/form"
import "./style.scss"

const VolumeTester = ({
    volumeBarsRef,
    startRecording,
    stopRecording,
}: {
    volumeBarsRef: RefObject<HTMLDivElement>[]
    startRecording: () => void
    stopRecording: () => void
}) => {
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
            <div />
            <div className="volume-tester">
                <div className="volume-tester__button">
                    <Button
                        text={`테스트 ${recording ? "종료" : "시작"}`}
                        classname="audio-test"
                        onClick={handleToggleRecording}
                    />
                </div>
                <div className="volume-tester__bar">
                    <span className="volume-tester__bar--icon" />
                    <div className="volume-tester__bar--stream">
                        {volumeBarsRef.map((ref, index) => (
                            <div key={index} ref={ref} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default VolumeTester
