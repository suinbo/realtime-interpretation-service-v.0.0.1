import { SetStateAction, useState } from "react"
import { useRecoilValue } from "recoil"
import { FormItemProp, SelectboxItemProp } from "../../../../../types/types"
import { optionAtom } from "../../../../../atoms/Atom"
import { Input, Selectbox } from "../../../../../components/form"
import { languages } from "../../../../../resources/data"

const SingleSettingForm = ({
    formItem: { chat_nm, chat_lang },
    setFormItem,
}: {
    formItem: FormItemProp
    setFormItem: React.Dispatch<SetStateAction<FormItemProp>>
}) => {
    const { language } = useRecoilValue(optionAtom)
    const selectboxItems = languages.map(({ value }) => ({ id: value, name: value }))

    const [transLang1, setTransLang1] = useState<SelectboxItemProp>({ id: language, name: language })
    const [transLang2, setTransLang2] = useState<SelectboxItemProp>({ id: "", name: "" })

    return (
        <div className="form__content">
            <div className="form__item--name">
                <span className="typo t20 w500">대화 명</span>
                <Input
                    type="text"
                    value={chat_nm}
                    placeholder="대화 명을 입력하세요."
                    onChange={value => setFormItem(prev => ({ ...prev, chat_nm: value }))}
                />
            </div>
            <div className="form__item--language">
                <span className="typo t20 w500">번역 언어</span>
                <div>
                    <Selectbox
                        items={selectboxItems}
                        selectedId={transLang1.id}
                        innerElement={<span className="sub-text typo t18">언어 1</span>}
                        setSelectedItem={setTransLang1}
                        style={{ height: 214 }}
                    />
                    <Selectbox
                        items={selectboxItems}
                        selectedId={transLang2.id}
                        innerElement={<span className="sub-text typo t18">언어 2</span>}
                        setSelectedItem={setTransLang2}
                        style={{ height: 214 }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SingleSettingForm
