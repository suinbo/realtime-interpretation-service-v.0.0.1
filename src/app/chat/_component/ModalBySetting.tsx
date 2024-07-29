import React, { SetStateAction, useEffect, useState } from "react"
import { Checkbox, Input, RadioGroup, Selectbox } from "@components/form"
import { FormItemProp } from "@app/setting/types"
import { languages } from "@resources/data"
import { useRecoilValue } from "recoil"
import { ChatroomAtom } from "@atoms/Atom"
import { supabase } from "@utils/superbase"
import { useQueryParams } from "@hooks/useQueryParams"
import { FormLayout } from "./PopupLayout"

const ModalBySetting = ({ view, setView }: { view: string; setView: React.Dispatch<SetStateAction<string>> }) => {
    const { id } = useQueryParams()
    const chatroomInfo = useRecoilValue(ChatroomAtom)

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
        share: <></>,
        setting:
            chatroomInfo.room_option == 1 ? (
                <FormLayout
                    formElement={
                        <>
                            <div className="form__item">
                                <p className="form__item-label">대화 명</p>
                                <Input
                                    type="text"
                                    value={chat_nm}
                                    placeholder="대화 명을 입력하세요."
                                    onChange={chat_nm => setFormItem(prev => ({ ...prev, chat_nm }))}
                                />
                            </div>
                            <div className="form__item">
                                <p className="form__item-label">번역 언어 1</p>
                                <Selectbox
                                    style={{ height: 260 }}
                                    items={languages}
                                    selectedId={String(chat_lang).split(",")[0]}
                                    onSelect={({ id }) => onSelect(id, 0)}
                                />
                            </div>
                            <div className="form__item">
                                <p className="form__item-label">번역 언어 2</p>
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
                    formElement={
                        <>
                            <div className="form__item">
                                <p className="form__item-label">대화 명</p>
                                <Input
                                    type="text"
                                    value={chat_nm}
                                    placeholder="대화 명을 입력하세요."
                                    onChange={chat_nm => setFormItem(prev => ({ ...prev, chat_nm }))}
                                />
                            </div>
                            <div className="form__item">
                                <p className="form__item--label">암호 설정</p>
                                <div>
                                    <Checkbox
                                        id="password-check"
                                        label="설정"
                                        isCheck={has_chat_pw}
                                        onChange={has_chat_pw => setFormItem(prev => ({ ...prev, has_chat_pw }))}
                                    />
                                    {has_chat_pw && (
                                        <div className="form__item--password-group">
                                            <span className="typo t14">암호</span>
                                            <Input
                                                type="password"
                                                value={chat_pw as string}
                                                placeholder="암호를 입력하세요."
                                                onChange={chat_pw => setFormItem(prev => ({ ...prev, chat_pw }))}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form__item">
                                <p className="form__item-label">호스트 승인</p>
                                <div>
                                    <RadioGroup
                                        name="host_auth"
                                        items={[
                                            { id: "1", value: "활성" },
                                            { id: "0", value: "비활성" },
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
            ),

        close: <></>,
    }

    return !!view && contentModal[view]
}

export default ModalBySetting
