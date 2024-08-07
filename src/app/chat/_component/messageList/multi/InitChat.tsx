import { UserAtom } from "@atoms/Atom"
import { Button } from "@components/form"
import LoadingDot from "@components/LoadingDot"
import { useTranscriptions2 } from "@hooks/audioSetting/useTranscriptions2"
import { useQueryParams } from "@hooks/useQueryParams"
import { useTranslation } from "next-i18next"
import { useRef } from "react"
import { useRecoilValue } from "recoil"
import { InitChatProp } from "@app/chat/types"
import { isPressController } from "@utils/common"
import cx from "classnames"

/** 말풍선 초기 레이아웃 */
const InitChat = ({ type, recordStatus, mediaRefs }: InitChatProp) => {
    const user = useRecoilValue(UserAtom)
    const { id, host, langs } = useQueryParams()
    const { t } = useTranslation()
    const buttonRefs = useRef<HTMLButtonElement>(null)

    const { isRecording, setIsRecording, isLoading, setIsLoading } = recordStatus[type]
    const mediaRef = mediaRefs[type]
    const [originLang, transLang] = (langs as string).split(",")

    const data: { [key: string]: any } = {
        my: useTranscriptions2({
            hostId: host as string,
            userId: user.id,
            roomId: id as string,
            langCd: originLang,
            transLangCd: transLang,
            isRecording,
            mediaRecorderRef: mediaRef,
            setIsLoading,
        }),
        your: useTranscriptions2({
            hostId: host as string,
            userId: null,
            roomId: id as string,
            langCd: transLang,
            transLangCd: originLang,
            isRecording,
            mediaRecorderRef: mediaRef,
            setIsLoading,
        }),
    }

    return (
        <div className="active-item">
            <Button
                refs={buttonRefs}
                onKeyUp={e => {
                    if (isPressController(e, "v")) {
                        data[type].stopRecording()
                        setIsRecording(false)
                    }
                }}
                onKeyDown={e => {
                    e.stopPropagation()
                    if (!isRecording && isPressController(e, "v")) {
                        data[type].startRecording()
                        setIsRecording(true)
                    }
                }}
                text={isRecording ? t("stop") : isLoading ? "-" : t("start")}
                onClick={() => {
                    if (isRecording) {
                        data[type].stopRecording()
                        setIsRecording(false)
                    } else {
                        data[type].startRecording()
                        setIsRecording(true)
                    }
                }}
                classname={cx("active-item--controller", type)}
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
