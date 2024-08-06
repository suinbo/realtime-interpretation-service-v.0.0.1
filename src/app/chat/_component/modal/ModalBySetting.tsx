import React, { SetStateAction, useEffect, useState } from "react"
import { Button, Checkbox, Input, RadioGroup, Selectbox } from "@components/form"
import { FormItemProp } from "@app/setting/types"
import { languages } from "@resources/data"
import { useRecoilValue } from "recoil"
import { ChatroomAtom, UserAtom } from "@atoms/Atom"
import { supabase } from "@utils/superbase"
import { useQueryParams } from "@hooks/useQueryParams"
import { FormLayout, SimpleLayout } from "./PopupLayout"
import { useTranslation } from "next-i18next"
import { convertKoreaTime } from "@utils/common"
import Popup from "@components/Popup"
import ToastPopup from "@components/ToastPopup"
import cookie from "@utils/cookie"
import useWindow from "@hooks/useWindow"

const ModalBySetting = ({ view, setView }: { view: string; setView: React.Dispatch<SetStateAction<string>> }) => {
    const { id, host } = useQueryParams()
    const { url } = useWindow()

    const user = useRecoilValue(UserAtom)
    const { t } = useTranslation()
    const chatroomInfo = useRecoilValue(ChatroomAtom)
    const [activeToast, setActiveToast] = useState<boolean>(false)

    const [{ chat_nm, chat_lang, has_chat_pw, chat_pw, host_auth, room_option }, setFormItem] =
        useState<FormItemProp>(chatroomInfo)

    useEffect(() => {
        setFormItem({ ...chatroomInfo, chat_lang: String(chatroomInfo.chat_lang).split(",") })
    }, [view, chatroomInfo])

    const onSelect = (id: string, index: number) =>
        setFormItem(prev => {
            const newFormItem = { ...prev }
            newFormItem.chat_lang = [...prev.chat_lang]
            newFormItem.chat_lang[index] = id
            return newFormItem
        })

    const contentModal: { [key: string]: React.ReactNode } = {
        share: (
            <Popup hasClosedBtn={false} style={{ width: 480 }} isActive={true}>
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
            room_option == 1 ? (
                <FormLayout
                    isActive={true}
                    formElement={
                        <>
                            <div className="form__item">
                                <p className="form__item-label typo w500">{t("chat_title")}</p>
                                <Input
                                    type="text"
                                    classname="typo t15"
                                    value={chat_nm}
                                    placeholder={t("")}
                                    onChange={chat_nm => setFormItem(prev => ({ ...prev, chat_nm }))}
                                />
                            </div>
                            <div className="form__item">
                                <p className="form__item-label typo w500">{t("trans_language")} 1</p>
                                <Selectbox
                                    style={{ height: 260 }}
                                    items={languages}
                                    selectedId={String(chat_lang).split(",")[0]}
                                    onSelect={({ id }) => onSelect(id, 0)}
                                />
                            </div>
                            <div className="form__item">
                                <p className="form__item-label typo w500">{t("trans_language")} 2</p>
                                <Selectbox
                                    style={{ height: 260 }}
                                    items={languages}
                                    selectedId={String(chat_lang).split(",")[1]}
                                    onSelect={({ id }) => onSelect(id, 1)}
                                />
                            </div>
                        </>
                    }
                    onSave={async () => {
                        const { data } = await supabase
                            .from("chatroom")
                            .update({
                                room_title: chat_nm,
                                chat_language: chat_lang.join(","),
                            })
                            .eq("room_id", id)
                            .select("*")

                        data?.length && setView("")
                    }}
                    onClose={() => {
                        setView("")
                        setFormItem(chatroomInfo)
                    }}
                />
            ) : (
                <FormLayout
                    isActive={true}
                    formElement={
                        <>
                            <div className="form__item">
                                <p className="form__item-label typo w500">{t("chat_title")}</p>
                                <Input
                                    type="text"
                                    classname="typo t15"
                                    value={chat_nm}
                                    placeholder={t("enter_chat_title")}
                                    onChange={chat_nm => setFormItem(prev => ({ ...prev, chat_nm }))}
                                />
                            </div>
                            <div className="form__item--password">
                                <p className="form__item--label typo w500">{t("set_password")}</p>
                                <div>
                                    <Checkbox
                                        id="password-check"
                                        label={t("setting")}
                                        isCheck={has_chat_pw}
                                        onChange={has_chat_pw => setFormItem(prev => ({ ...prev, has_chat_pw }))}
                                    />
                                    {has_chat_pw && (
                                        <div className="form__item--password-group">
                                            <span className="typo t15">{t("password")}</span>
                                            <Input
                                                type="password"
                                                classname="typo t15"
                                                value={chat_pw as string}
                                                placeholder={t("enter_password")}
                                                onChange={chat_pw => setFormItem(prev => ({ ...prev, chat_pw }))}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form__item">
                                <p className="form__item-label typo w500">{t("host_approval")}</p>
                                <div>
                                    <RadioGroup
                                        name="host_auth"
                                        items={[
                                            { id: "1", value: t("active") },
                                            { id: "0", value: t("inactive") },
                                        ]}
                                        selectedId={String(host_auth)}
                                        onChange={selectedId =>
                                            setFormItem(prev => ({ ...prev, host_auth: Number(selectedId) }))
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
                                room_title: chat_nm,
                                room_password: chat_pw,
                                approval_required: host_auth,
                            })
                            .eq("room_id", id)
                            .select("*")

                        data?.length && setView("")
                    }}
                    onClose={() => {
                        setView("")
                        setFormItem(chatroomInfo)
                    }}
                />
            ),

        close: (
            <SimpleLayout
                isActive={true}
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

                                if (host == user.id) {
                                    // 호스트일 경우 대화방 만료
                                    await supabase
                                        .from("chatroom")
                                        .update({
                                            expired_at: convertKoreaTime(Date.now()),
                                        })
                                        .eq("room_id", id)
                                        .select("*")
                                } else {
                                    //  참여자일 경우 그냥 방 나가기
                                    // const { data } = await supabase
                                    //     .from("chatroom")
                                    //     .update({
                                    //         member_id: null,
                                    //         member_email: null,
                                    //     })
                                    //     .eq("room_id", id)
                                    //     .select("*")
                                    // if (data?.length) {
                                    //     setView("")
                                    // }
                                }

                                cookie.removeItem("languageSet")
                                window.close()
                            }}
                            classname="lined--1 typo t15 w500"
                        />
                        <Button
                            text={t("no")}
                            onClick={() => {
                                setView("")
                                setFormItem(chatroomInfo)
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
