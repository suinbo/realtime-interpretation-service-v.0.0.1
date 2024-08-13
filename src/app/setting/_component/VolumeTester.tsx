import { RefObject, useState } from "react"
import { Button } from "@components/form"
import { useTranslation } from "next-i18next"
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
    const { t } = useTranslation()
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
                        text={`${t("test")} ${recording ? t("stop") : t("start")}`}
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
