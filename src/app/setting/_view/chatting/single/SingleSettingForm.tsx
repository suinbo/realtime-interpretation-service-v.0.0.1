import { RefObject, SetStateAction } from "react"
import { FormItemProp, SelectboxItemProp } from "@app/setting/types"
import { languages } from "@resources/data"
import { Input, Selectbox } from "@components/form"
import { useTranslation } from "next-i18next"
import { FormItem } from "@components/layout"

const SingleSettingForm = ({
    refs,
    formItem: { chat_nm, chat_lang },
    setFormItem,
}: {
    refs: { [key: string]: RefObject<HTMLInputElement> }
    formItem: FormItemProp
    setFormItem: React.Dispatch<SetStateAction<FormItemProp>>
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
            <FormItem
                id="name"
                title={t("chat_title")}
                element={
                    <Input
                        refs={refs.name}
                        type="text"
                        classname="typo 15"
                        value={chat_nm}
                        placeholder={t("enter_chat_title")}
                        onChange={value => setFormItem(prev => ({ ...prev, chat_nm: value }))}
                    />
                }
            />
            <FormItem
                id="language"
                title={t("trans_language")}
                element={
                    <div>
                        <Selectbox
                            items={selectboxItems}
                            selectedId={chat_lang[0]}
                            innerElement={<span className="sub-text typo t15">{t("language_1")}</span>}
                            onSelect={selectedItem => onSelect(0, selectedItem)}
                            style={{ height: 214 }}
                        />
                        <Selectbox
                            items={selectboxItems}
                            selectedId={chat_lang[1]}
                            innerElement={<span className="sub-text typo t15">{t("language_2")}</span>}
                            onSelect={selectedItem => onSelect(1, selectedItem)}
                            style={{ height: 214 }}
                        />
                    </div>
                }
            />
        </div>
    )
}

export default SingleSettingForm
