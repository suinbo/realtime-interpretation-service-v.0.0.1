import { SetStateAction, useState } from "react"
import { FormItemProp } from "../../../../../types/types"
import { Checkbox, Input, RadioGroup } from "../../../../../components/form"

const MultiSettingForm = ({
    formItem: { chat_nm, chat_pw, host_auth },
    setFormItem,
}: {
    formItem: FormItemProp
    setFormItem: React.Dispatch<SetStateAction<FormItemProp>>
}) => {
    const [settings, setSettings] = useState<{ chat_nm: string; has_password: boolean; has_auth: boolean }>({
        chat_nm: "",
        has_password: false,
        has_auth: false,
    })

    return (
        <>
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
                <div className="form__item--password">
                    <span className="typo t20 w500">암호 설정</span>

                    <div>
                        <Checkbox
                            id="password-check"
                            label="설정"
                            onChange={isChecked => setSettings(prev => ({ ...prev, has_password: isChecked }))}
                        />
                        {settings.has_password && (
                            <div className="form__item--password-group">
                                <span className="typo t18">암호</span>
                                <Input
                                    type="password"
                                    value={chat_pw}
                                    placeholder="암호를 입력하세요."
                                    onChange={value => setFormItem(prev => ({ ...prev, chat_pw: value }))}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="form__item--auth">
                    <span className="typo t20 w500">호스트 승인</span>
                    <div>
                        <RadioGroup
                            name="host_auth"
                            items={[
                                { id: "1", value: "활성" },
                                { id: "0", value: "비활성" },
                            ]}
                            selectedId={String(host_auth)}
                            onChange={selectedId => setSettings(prev => ({ ...prev, auth: Number(selectedId) }))}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MultiSettingForm
