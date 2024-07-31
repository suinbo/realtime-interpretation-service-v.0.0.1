import { FormItemProp, SelectboxItemProp } from "@app/setting/types"
import { Checkbox, Input, RadioGroup, Selectbox } from "@components/form"
import { languages } from "@resources/data"
import { RefObject, SetStateAction } from "react"

const MultiSettingForm = ({
    refs,
    formItem: { chat_nm, chat_lang, has_chat_pw, chat_pw, host_auth },
    setFormItem,
}: {
    refs: { [key: string]: RefObject<HTMLInputElement> }
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
        <>
            <div className="form__content">
                <div className="form__item--name">
                    <span className="typo t20 w500">대화 명</span>
                    <Input
                        refs={refs.name}
                        type="text"
                        classname="typo t17"
                        value={chat_nm}
                        placeholder="대화 명을 입력하세요."
                        onChange={chat_nm => setFormItem(prev => ({ ...prev, chat_nm }))}
                    />
                </div>
                <div className="form__item--language">
                    <span className="typo t20 w500">번역 언어</span>
                    <div>
                        <Selectbox
                            items={selectboxItems}
                            selectedId={chat_lang[1]}
                            innerElement={<span className="sub-text typo t18">언어 1</span>}
                            onSelect={selectedItem => onSelect(1, selectedItem)}
                            style={{ height: 214 }}
                        />
                    </div>
                </div>
                <div className="form__item--password">
                    <span className="typo t20 w500">암호 설정</span>
                    <div className="typo t18">
                        <Checkbox
                            id="password-check"
                            label="설정"
                            isCheck={has_chat_pw}
                            onChange={has_chat_pw => setFormItem(prev => ({ ...prev, has_chat_pw }))}
                        />
                        {has_chat_pw && (
                            <div className="form__item--password-group">
                                <span className="typo t18">암호</span>
                                <Input
                                    refs={refs.password}
                                    type="password"
                                    classname="typo t17"
                                    value={chat_pw as string}
                                    placeholder="암호를 입력하세요."
                                    onChange={chat_pw => setFormItem(prev => ({ ...prev, chat_pw }))}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="form__item--auth">
                    <span className="typo t20 w500">호스트 승인</span>
                    <div className="typo t18">
                        <RadioGroup
                            name="host_auth"
                            items={[
                                { id: "1", value: "활성" },
                                { id: "0", value: "비활성" },
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
