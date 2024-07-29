import { SetStateAction } from "react"
import { FormItemProp, SelectboxItemProp } from "@app/setting/types"
import { languages } from "@resources/data"
import { Input, Selectbox } from "@components/form"

const SingleSettingForm = ({
    formItem: { chat_nm, chat_lang },
    setFormItem,
}: {
    formItem: FormItemProp
    setFormItem: React.Dispatch<SetStateAction<FormItemProp>>
}) => {
    const selectboxItems = languages.map(({ id, name }) => ({ id, name }))

    const onSelect = (index: number, item: SelectboxItemProp) => {
        setFormItem(prev => {
            const newFormItem = { ...prev }
            newFormItem.chat_lang = [...prev.chat_lang]
            newFormItem.chat_lang[index] = item.id

            return newFormItem
        })
    }

    return (
        <div className="form__content">
            <div className="form__item--name">
                <span className="typo t20 w500">대화 명</span>
                <Input
                    type="text"
                    classname="typo t18"
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
                        selectedId={chat_lang[0]}
                        innerElement={<span className="sub-text typo t18">언어 1</span>}
                        onSelect={selectedItem => onSelect(0, selectedItem)}
                        style={{ height: 214 }}
                    />
                    <Selectbox
                        items={selectboxItems}
                        selectedId={chat_lang[1]}
                        innerElement={<span className="sub-text typo t18">언어 2</span>}
                        onSelect={selectedItem => onSelect(1, selectedItem)}
                        style={{ height: 214 }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SingleSettingForm
