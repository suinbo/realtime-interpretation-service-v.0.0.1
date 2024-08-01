import { Button, Selectbox } from "@components/form"
import { FormLayout, SimpleLayout } from "./PopupLayout"
import { languages } from "@resources/data"
import { supabase } from "@utils/superbase"
import { useQueryParams } from "@hooks/useQueryParams"
import { SetStateAction, useMemo, useState } from "react"
import { SelectboxItem } from "@components/form/Selectbox"
import { useTranslation } from "next-i18next"
import cookie from "@utils/cookie"

const ModalByLanguage = ({ setActive }: { setActive: React.Dispatch<SetStateAction<boolean>> }) => {
    const { id, langs } = useQueryParams()
    const [originLang, transLang] = (langs as string).split(",")
    const { t, i18n } = useTranslation()

    const language = useMemo(() => languages.find(lang => lang.id == i18n.language), [i18n])
    const [selectedItem, setSelectedItem] = useState<SelectboxItem>(language as SelectboxItem)

    const [activeChageModal, setActiveChangeModal] = useState<boolean>(false)

    const contentModal: { [key: string]: React.ReactNode } = {
        checkLanguage: (
            <SimpleLayout
                isActive={true}
                text={
                    <>
                        {/* <span className="typo w500">유효하지 않은</span> 링크 입니다. */}
                        <span className="typo t16 w500">{t("check_language", { val: language?.name })}</span>
                        <span className="typo t15 subtext">{`[ ${language?.name} ] has been set. Would you like to keep it as is?`}</span>
                    </>
                }
                controller={
                    <div className="popup__content--btn">
                        <Button
                            text="Yes"
                            onClick={() => {
                                setActive(false)

                                //쿠키에 저장
                                cookie.setItem({ key: "languageSet", value: transLang })
                            }}
                            classname="lined--1 typo t17 w500"
                        />
                        <Button
                            text="No"
                            onClick={() => setActiveChangeModal(true)}
                            classname="secondary typo t17 w500"
                        />
                    </div>
                }
            />
        ),
        changeLanguage: (
            <FormLayout
                isActive={true}
                title="Change language settings"
                formElement={
                    <>
                        <div className="form__item">
                            <p className="form__item-label typo w500">Language</p>
                            <Selectbox
                                items={languages}
                                selectedId={selectedItem.id}
                                onSelect={selectedItem => setSelectedItem(selectedItem)}
                                style={{ height: 250 }}
                            />
                        </div>
                    </>
                }
                onSave={async () => {
                    const { data } = await supabase
                        .from("chatroom")
                        .update({
                            chat_language: [originLang, selectedItem.id],
                        })
                        .eq("room_id", id)
                        .select("*")

                    // 설정 언어 쿠키에 저장
                    if (data?.length) {
                        cookie.setItem({ key: "languageSet", value: selectedItem.id })
                        i18n.changeLanguage(selectedItem.id)
                    }
                }}
                onClose={() => setActiveChangeModal(false)}
            />
        ),
    }

    return activeChageModal ? contentModal["changeLanguage"] : contentModal["checkLanguage"]
}

export default ModalByLanguage
