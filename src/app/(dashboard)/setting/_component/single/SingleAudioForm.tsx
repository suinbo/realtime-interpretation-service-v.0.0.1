import { useEffect, useRef, useState } from "react"
import { SelectboxItemProp } from "../../../../../types/types"
import { getAudioList } from "../../../../../utils/common"
import { Selectbox } from "../../../../../components/form"

const SingleAudioForm = () => {
    const [selectedItem, setSelectedItem] = useState<SelectboxItemProp>({ id: "", name: "" })
    const [audioList, setAudioList] = useState<SelectboxItemProp[]>([])

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

    return (
        <div className="form__content">
            <div className="form__item--microphone">
                <span className="typo t20 w500">마이크</span>
                <div>
                    <Selectbox items={audioList} selectedId={selectedItem.id} setSelectedItem={setSelectedItem} />
                </div>
            </div>
            <div className="form__item--test">
                {/* <div className="volumebar">
                            {volumeBarsRef.map((ref, index) => (
                                <div key={index} ref={ref} className="volumebar__item" />
                            ))}
                        </div>
                        <button onClick={startRecording}>Start Recording</button>
                        <button onClick={stopRecording}>Stop Recording</button>
 */}
            </div>
        </div>
    )
}

export default SingleAudioForm
