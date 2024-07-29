import React, { useEffect, useState } from "react"
import { SelectboxItemProp } from "../../../types"
import { Selectbox } from "@components/form"
import { VolumeTester } from "@app/setting/_component"
import { useControlVolume } from "@hooks/audioSetting/useControlVolume"

const MultiAudioForm = () => {
    const [selectedItem, setSelectedItem] = useState<SelectboxItemProp>({ id: "", name: "" })

    // 선택한 디바이스의 스트림 데이터 가져오기
    const { audioDevices, ...data } = useControlVolume(selectedItem?.id)

    useEffect(() => {
        audioDevices && setSelectedItem(audioDevices[0])
    }, [audioDevices])

    return (
        <div className="form__content">
            <div className="form__item--microphone">
                <span className="typo t20 w500">마이크</span>
                <div>
                    <Selectbox
                        items={audioDevices}
                        selectedId={selectedItem?.id}
                        onSelect={selectedItem => setSelectedItem(selectedItem)}
                    />
                </div>
            </div>
            <div className="form__item--tester">
                <VolumeTester {...data} />
            </div>
        </div>
    )
}

export default MultiAudioForm
