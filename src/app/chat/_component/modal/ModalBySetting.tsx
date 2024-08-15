import React, { useEffect, useState } from "react"
import { Button, Checkbox, Input, RadioGroup, Selectbox } from "@components/form"
import { languages } from "@resources/data"
import { useRecoilValue } from "recoil"
import { ChatroomAtom, UserAtom } from "@atoms/Atom"
import { supabase } from "@utils/superbase"
import { FormLayout, SimpleLayout } from "./PopupLayout"
import { useTranslation } from "next-i18next"
import { convertKoreaTime } from "@utils/common"
import Popup from "@components/Popup"
import ToastPopup from "@components/ToastPopup"
import useWindow from "@hooks/useWindow"
import { ModalBySettingProp } from "@app/chat/types"
import { ChatroomProp } from "@hooks/chatroom/useRealtimeChatroom"

const ModalBySetting = ({ view, setView }: ModalBySettingProp) => {
    const { url } = useWindow()
    const { t, i18n } = useTranslation()

    const user = useRecoilValue(UserAtom)
    const chatroomInfo = useRecoilValue(ChatroomAtom)
    const [activeToast, setActiveToast] = useState<boolean>(false)

    const [
        { room_id, room_title, chat_language, creator_id, room_password, approval_required, has_password },
        setFormItem,
    ] = useState<ChatroomProp & { has_password: boolean }>({
        ...chatroomInfo,
        has_password: false,
    })

    useEffect(() => {
        setFormItem(prev => ({
            ...chatroomInfo,
            chat_language: String(chatroomInfo.chat_language).split(","),
            has_password: !!chatroomInfo.room_password,
        }))
    }, [view, chatroomInfo])

    const onSelect = (id: string, index: number) =>
        setFormItem(prev => {
            const newFormItem = { ...prev }
            newFormItem.chat_language = [...prev.chat_language]
            newFormItem.chat_language[index] = id
            return newFormItem
        })

    const contentModal: { [key: string]: React.ReactNode } = {
        share: (
            <Popup hasClosedBtn={false} style={{ width: 480 }} isActive={view == "share"}>
                <div className="popup__content">
                    <div className="popup__content--title">
                        <p className="typo t18 notice">
                            <b>{t("copy_url")}</b>
                            <span className="typo t14">※ {url}</span>
                        </p>
                        <span className="inner-close-btn" onClick={() => setView("")} />
                    </div>
                    <div className="popup__content--btn">
                        <Button
                            text={
                                <div className="copy-text">
                                    <span className="typo t15">URL {t("copy")}</span>
                                </div>
                            }
                            onClick={() => {
                                navigator.clipboard.writeText(url).then(() => {
                                    setActiveToast(true)
                                    setView("")
                                })
                            }}
                            classname="typo t15 w500 grayed"
                        />
                    </div>
                </div>
            </Popup>
        ),
        setting:
            chatroomInfo.room_option == 1 ? (
                <FormLayout
                    isActive={view == "setting"}
                    formElement={
                        <>
                            <div className="form__item">
                                <p className="form__item-label typo t17 w500">{t("chat_title")}</p>
                                <Input
                                    type="text"
                                    classname="typo t15"
                                    value={room_title}
                                    placeholder={t("enter_chat_title")}
                                    onChange={room_title => setFormItem(prev => ({ ...prev, room_title }))}
                                />
                            </div>
                            <div className="form__item">
                                <p className="form__item-label typo t17 w500">{t("trans_language")} 1</p>
                                <Selectbox
                                    style={{ height: 260 }}
                                    items={languages}
                                    selectedId={String(chat_language).split(",")[0]}
                                    onSelect={({ id }) => onSelect(id, 0)}
                                />
                            </div>
                            <div className="form__item">
                                <p className="form__item-label typo t17 w500">{t("trans_language")} 2</p>
                                <Selectbox
                                    style={{ height: 260 }}
                                    items={languages}
                                    selectedId={String(chat_language).split(",")[1]}
                                    onSelect={({ id }) => onSelect(id, 1)}
                                />
                            </div>
                        </>
                    }
                    onSave={async () => {
                        const { data } = await supabase
                            .from("chatroom")
                            .update({
                                room_title,
                                chat_language: chat_language.join(","),
                            })
                            .eq("room_id", room_id)
                            .select("*")

                        data?.length && setView("")
                        i18n.changeLanguage(chat_language[0])
                    }}
                    onClose={() => {
                        setView("")
                    }}
                />
            ) : (
                <FormLayout
                    isActive={view == "setting"}
                    formElement={
                        <>
                            <div className="form__item">
                                <p className="form__item-label typo w500">{t("chat_title")}</p>
                                <Input
                                    type="text"
                                    classname="typo t15"
                                    value={room_title}
                                    placeholder={t("enter_chat_title")}
                                    onChange={room_title => setFormItem(prev => ({ ...prev, room_title }))}
                                />
                            </div>
                            <div className="form__item--password">
                                <p className="form__item--label typo w500">{t("set_password")}</p>
                                <div className="typo t15">
                                    <Checkbox
                                        id="password-check"
                                        label={t("setting")}
                                        isCheck={has_password}
                                        onChange={has_password => setFormItem(prev => ({ ...prev, has_password }))}
                                    />
                                    {has_password && (
                                        <form className="form__item--password-group">
                                            <span className="typo t15">{t("password")}</span>
                                            <Input
                                                type="password"
                                                classname="typo t15"
                                                value={room_password as string}
                                                placeholder={t("enter_password")}
                                                onChange={room_password =>
                                                    setFormItem(prev => ({ ...prev, room_password }))
                                                }
                                            />
                                        </form>
                                    )}
                                </div>
                            </div>
                            <div className="form__item">
                                <p className="form__item-label typo w500">{t("host_approval")}</p>
                                <div className="typo t15">
                                    <RadioGroup
                                        name="host_auth"
                                        items={[
                                            { id: "1", value: t("active") },
                                            { id: "0", value: t("inactive") },
                                        ]}
                                        selectedId={String(approval_required)}
                                        onChange={selectedId =>
                                            setFormItem(prev => ({ ...prev, approval_required: Number(selectedId) }))
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    }
                    onSave={async () => {
                        const { data } = await supabase
                            .from("chatroom")
                            .update({
                                room_title,
                                room_password: has_password ? room_password : "",
                                approval_required,
                            })
                            .eq("room_id", room_id)
                            .select("*")

                        data?.length && setView("")
                    }}
                    onClose={() => {
                        setView("")
                    }}
                />
            ),

        close: (
            <SimpleLayout
                isActive={view == "close"}
                hasTopIcon={false}
                text={
                    <>
                        {/* 대화를<span className="typo w500"> 종료</span>하시겠습니까? */}
                        {t("end_chat")}
                    </>
                }
                controller={
                    <div className="popup__content--btn">
                        <Button
                            text={t("yes")}
                            onClick={async () => {
                                setView("")

                                if (creator_id == user.id) {
                                    // 호스트일 경우 대화방 만료
                                    await supabase
                                        .from("chatroom")
                                        .update({
                                            expired_at: convertKoreaTime(Date.now()),
                                        })
                                        .eq("room_id", room_id)
                                        .select("*")
                                }
                                window.close()
                            }}
                            classname="lined--1 typo t15 w500"
                        />
                        <Button
                            text={t("no")}
                            onClick={() => {
                                setView("")
                            }}
                            classname="secondary typo t15 w500 "
                        />
                    </div>
                }
            />
        ),
    }

    return (
        <>
            {activeToast && <ToastPopup text={t("copied")} activeToast={activeToast} setActiveToast={setActiveToast} />}
            {!!view && contentModal[view]}
        </>
    )
}

export default ModalBySetting
