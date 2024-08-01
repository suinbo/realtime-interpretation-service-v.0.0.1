import { RefObject, SetStateAction } from "react"
import { FormItemProp, SelectboxItemProp } from "@app/setting/types"
import { languages } from "@resources/data"
import { Input, Selectbox } from "@components/form"
import { useTranslation } from "next-i18next"

const SingleSettingForm = ({
    refs,
    formItem: { chat_nm, chat_lang },
    setFormItem,
    isFocused,
}: {
    refs: { [key: string]: RefObject<HTMLInputElement> }
    formItem: FormItemProp
    setFormItem: React.Dispatch<SetStateAction<FormItemProp>>
    isFocused: boolean
}) => {
    const { t } = useTranslation()
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
                <span className="typo t18 w500">{t("chat_title")}</span>
                <Input
                    refs={refs.name}
                    type="text"
                    classname="typo t17"
                    value={chat_nm}
                    placeholder={t("enter_chat_title")}
                    onChange={value => setFormItem(prev => ({ ...prev, chat_nm: value }))}
                />
            </div>
            <div className="form__item--language">
                <span className="typo t18 w500">{t("trans_language")}</span>
                <div>
                    <Selectbox
                        items={selectboxItems}
                        selectedId={chat_lang[0]}
                        innerElement={<span className="sub-text typo t17">{t("language_1")}</span>}
                        onSelect={selectedItem => onSelect(0, selectedItem)}
                        style={{ height: 214 }}
                    />
                    <Selectbox
                        isFocused={isFocused}
                        items={selectboxItems}
                        selectedId={chat_lang[1]}
                        innerElement={<span className="sub-text typo t17">{t("language_2")}</span>}
                        onSelect={selectedItem => onSelect(1, selectedItem)}
                        style={{ height: 214 }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SingleSettingForm
