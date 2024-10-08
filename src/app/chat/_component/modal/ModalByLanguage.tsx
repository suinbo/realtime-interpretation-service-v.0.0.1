import { Button, Selectbox } from "@components/form"
import { languages } from "@resources/data"
import { supabase } from "@utils/superbase"
import { SetStateAction, useMemo, useState } from "react"
import { SelectboxItem } from "@components/form/Selectbox"
import { useTranslation } from "next-i18next"
import cookie from "@utils/cookie"
import { parsedCookie } from "@utils/common"
import { useRecoilValue } from "recoil"
import { ChatroomAtom } from "@atoms/Atom"
import { Modal } from "@components/layout"

const ModalByLanguage = ({
    setActive,
    langCd: { langCd, transLangCd },
}: {
    setActive: React.Dispatch<SetStateAction<boolean>>
    langCd: { langCd: string; transLangCd: string }
}) => {
    const { room_id } = useRecoilValue(ChatroomAtom)
    const { t, i18n } = useTranslation()

    const language = useMemo(() => languages.find(lang => lang.id == i18n.language), [i18n])
    const [selectedItem, setSelectedItem] = useState<SelectboxItem>(language as SelectboxItem)

    const [activeChageModal, setActiveChangeModal] = useState<boolean>(false)

    const contentModal: { [key: string]: React.ReactNode } = {
        checkLanguage: (
            <Modal.SimpleLayout
                isActive={true}
                text={
                    <>
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

                                // 언어셋 쿠키에 저장
                                cookie.setItem({
                                    key: room_id as string,
                                    value: JSON.stringify({
                                        languageSet: transLangCd,
                                        is_passed: parsedCookie(room_id) ? parsedCookie(room_id).is_passed : null,
                                    }),
                                })
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
            <Modal.FormLayout
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
                            chat_language: [langCd, selectedItem.id].join(","),
                        })
                        .eq("room_id", room_id)
                        .select("*")

                    // 설정 언어 쿠키에 저장
                    if (data?.length) {
                        cookie.setItem({
                            key: room_id,
                            value: JSON.stringify({
                                languageSet: selectedItem.id,
                                is_passed: parsedCookie(room_id) ? parsedCookie(room_id).is_passed : null,
                            }),
                        })

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
