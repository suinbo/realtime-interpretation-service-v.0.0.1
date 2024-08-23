import React, { useEffect, useState } from "react"
import { SelectboxItemProp } from "../../../types"
import { Selectbox } from "@components/form"
import { VolumeTester } from "@app/setting/_component"
import { useControlVolume } from "@hooks/audioSetting/useControlVolume"
import { useTranslation } from "next-i18next"
import { FormItem } from "@components/layout"

const MultiAudioForm = () => {
    const { t } = useTranslation()
    const [selectedItem, setSelectedItem] = useState<SelectboxItemProp>({ id: "", name: "" })

    // 선택한 디바이스의 스트림 데이터 가져오기
    const { audioDevices, ...data } = useControlVolume(selectedItem?.id)

    useEffect(() => {
        audioDevices && setSelectedItem(audioDevices[0])
    }, [audioDevices])

    return (
        <div className="form__content">
            <FormItem
                id="microphone"
                title={t("mic")}
                element={
                    <div>
                        <Selectbox
                            items={audioDevices}
                            selectedId={selectedItem?.id}
                            onSelect={selectedItem => setSelectedItem(selectedItem)}
                        />
                    </div>
                }
            />
            <div className="form__item--tester">
                <VolumeTester {...data} disabled={!audioDevices.length} />
            </div>
        </div>
    )
}

export default MultiAudioForm
