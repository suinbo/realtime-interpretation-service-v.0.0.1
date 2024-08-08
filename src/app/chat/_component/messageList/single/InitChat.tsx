import { SingleInitChatProp } from "@app/chat/types"
import { Button } from "@components/form"
import LoadingDot from "@components/LoadingDot"
import { isPressController } from "@utils/common"
import { useTranslation } from "next-i18next"

/** 말풍선 초기 레이아웃 */
const InitChat = ({
    buttonRefs,
    data: { isRecording, isLoading, setIsRecording, startRecording, stopRecording },
}: SingleInitChatProp) => {
    const { t } = useTranslation()

    return (
        <div className="active-item">
            <Button
                refs={buttonRefs}
                onKeyUp={e => {
                    if (isPressController(e, "v")) {
                        stopRecording()
                        setIsRecording(false)
                    }
                }}
                onKeyDown={e => {
                    e.stopPropagation()
                    if (!isRecording && isPressController(e, "v")) {
                        startRecording()
                        setIsRecording(true)
                    }
                }}
                text={isRecording ? t("stop") : isLoading ? "-" : t("start")}
                onClick={() => {
                    if (isRecording) {
                        stopRecording()
                        setIsRecording(false)
                    } else {
                        startRecording()
                        setIsRecording(true)
                    }
                }}
                classname="active-item--controller"
                disabled={isLoading}
            />
            {isRecording ? (
                <div className="active-item--loading">
                    <LoadingDot text={t("listening")} />
                </div>
            ) : isLoading ? (
                <div className="active-item--loading">
                    <LoadingDot text={t("translating")} />
                </div>
            ) : null}
        </div>
    )
}

export default InitChat
