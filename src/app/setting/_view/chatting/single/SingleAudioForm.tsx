import { useEffect, useRef, useState } from "react"
import { SelectboxItemProp } from "../../../types"
import { getAudioList } from "@utils/common"
import { Selectbox } from "@components/form"
import { VolumeTester } from "@app/setting/_component"
import { useControlVolume } from "@hooks/useControlVolume"
import "../style.scss"

const SingleAudioForm = () => {
    const [selectedItem, setSelectedItem] = useState<SelectboxItemProp>({ id: "", name: "" })
    const [audioList, setAudioList] = useState<SelectboxItemProp[]>([])

    const volumeBarsRef = Array.from({ length: 30 }, () => useRef<HTMLDivElement>(null))

    const data = useControlVolume(volumeBarsRef)

    useEffect(() => {
        const fetchAudioList = async () => {
            const audioDevices = await getAudioList()
            setAudioList(audioDevices)
        }

        fetchAudioList()

        const handleVisibilityChange = async () => {
            if (!document.hidden) {
                fetchAudioList()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [])

    console.log("selectedItem:: ", selectedItem)

    return (
        <div className="form__content">
            <div className="form__item--microphone">
                <span className="typo t20 w500">마이크</span>
                <div>
                    <Selectbox
                        items={audioList}
                        selectedId={audioList[0]?.id}
                        // selectedId={audioList.find(audio => audio.id == data.currentDevice?.id)?.id}
                        setSelectedItem={setSelectedItem}
                    />
                </div>
            </div>
            <div className="form__item--test">
                <VolumeTester data={data} volumeBarsRef={volumeBarsRef} />
            </div>
        </div>
    )
}

export default SingleAudioForm
