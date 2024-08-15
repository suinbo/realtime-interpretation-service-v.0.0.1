import { FormItemProp, SelectboxItemProp } from "@app/setting/types"
import { Checkbox, Input, RadioGroup, Selectbox } from "@components/form"
import { languages } from "@resources/data"
import { useTranslation } from "next-i18next"
import { RefObject, SetStateAction } from "react"

const MultiSettingForm = ({
    refs,
    formItem: { chat_nm, chat_lang, has_chat_pw, chat_pw, host_auth },
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
        <>
            <div className="form__content">
                <div className="form__item--name">
                    <span className="typo t18 w500">{t("chat_title")}</span>
                    <Input
                        refs={refs.name}
                        type="text"
                        classname="typo t17"
                        value={chat_nm}
                        placeholder={t("enter_chat_title")}
                        onChange={chat_nm => setFormItem(prev => ({ ...prev, chat_nm }))}
                    />
                </div>
                <div className="form__item--language">
                    <span className="typo t18 w500">{t("trans_language")}</span>
                    <div>
                        <Selectbox
                            isFocused={isFocused}
                            items={selectboxItems}
                            selectedId={chat_lang[1]}
                            onSelect={selectedItem => onSelect(1, selectedItem)}
                            style={{ height: 214 }}
                        />
                    </div>
                </div>
                <div className="form__item--password">
                    <span className="typo t18 w500">{t("set_password")}</span>
                    <div className="typo t15">
                        <Checkbox
                            id="password-check"
                            label={t("setting")}
                            isCheck={has_chat_pw}
                            onChange={has_chat_pw => setFormItem(prev => ({ ...prev, has_chat_pw }))}
                        />
                        {has_chat_pw && (
                            <form className="form__item--password-group">
                                <span className="typo t15">{t("password")}</span>
                                <Input
                                    refs={refs.password}
                                    type="password"
                                    classname="typo t15"
                                    value={chat_pw as string}
                                    placeholder={t("enter_password")}
                                    onChange={chat_pw => setFormItem(prev => ({ ...prev, chat_pw }))}
                                />
                            </form>
                        )}
                    </div>
                </div>
                <div className="form__item--auth">
                    <span className="typo t18 w500">{t("host_approval")}</span>
                    <div className="typo t15">
                        <RadioGroup
                            name="host_auth"
                            items={[
                                { id: "1", value: t("active") },
                                { id: "0", value: t("inactive") },
                            ]}
                            selectedId={String(host_auth)}
                            onChange={selectedId => setFormItem(prev => ({ ...prev, host_auth: Number(selectedId) }))}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MultiSettingForm
