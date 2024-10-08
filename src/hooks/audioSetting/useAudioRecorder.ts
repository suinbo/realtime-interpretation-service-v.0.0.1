import { API, MIN_BLOB_SIZE, TRANS_MESSAGE } from "@resources/constant"
import { supabase } from "@utils/superbase"
import OpenAI from "openai"
import { SetStateAction, useCallback } from "react"

export const useAudioRecorder = ({
    hostId,
    userId,
    roomId,
    langCd,
    transLangCd,
    isRecording,
    setIsLoading,
    mediaRecorderRef,
    setMessage,
}: {
    hostId: string
    userId: string | null
    roomId: string
    langCd: string
    transLangCd: string
    isRecording: boolean
    setIsLoading: React.Dispatch<SetStateAction<boolean>>
    mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>
    setMessage: React.Dispatch<SetStateAction<string>>
}) => {
    const onShowMessage = () => {
        mediaRecorderRef.current = null
        setMessage(TRANS_MESSAGE.EMPTY)
        setIsLoading(false)
    }

    const startRecording = useCallback(async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                const mediaRecorder = new MediaRecorder(stream)

                let audioChunks: Blob[] = []
                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        // 타이머 끝난 후 실행
                        audioChunks.push(event.data)
                    }
                }

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
                    const audioFile = new File([audioBlob], "audio.webm", {
                        type: "audio/webm",
                        lastModified: Date.now(),
                    })

                    // 1초 미만으로 인식된 경우
                    if (mediaRecorderRef.current && audioBlob.size < MIN_BLOB_SIZE) {
                        onShowMessage()
                        return
                    }

                    try {
                        const openai = new OpenAI({
                            apiKey: process.env.NEXT_PUBLIC_WHISPER_API_KEY,
                            dangerouslyAllowBrowser: true,
                        })

                        const text = await openai.audio.transcriptions.create({
                            file: audioFile,
                            model: "whisper-1",
                            response_format: "text",
                            language: langCd,
                        })

                        if (!String(text).trim()) {
                            onShowMessage()
                            return
                        }

                        // 3. 영어 번역 API 호출
                        const englishResponse = await fetch(API.TRANSLATION_API, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                            },
                            body: JSON.stringify({
                                model: "gpt-4",
                                messages: [
                                    {
                                        role: "system",
                                        content:
                                            "You are a helpful assistant that translates text concisely, providing only the main translation without any extra information.",
                                    },
                                    {
                                        role: "user",
                                        content: `Translate the following text to English:\n\n${text}`,
                                    },
                                ],
                                max_tokens: 1000,
                                temperature: 0.3,
                            }),
                        })

                        // 3-1. 선택 언어 번역 API 호출
                        const translationResponse = await fetch(API.TRANSLATION_API, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                            },
                            body: JSON.stringify({
                                model: "gpt-4",
                                messages: [
                                    {
                                        role: "system",
                                        content:
                                            "You are a helpful assistant that translates text concisely, providing only the main translation without any extra information.",
                                    },
                                    {
                                        role: "user",
                                        content: `Translate the following text to ${transLangCd}:\n\n${text}`,
                                    },
                                ],
                                max_tokens: 1000,
                                temperature: 0.3,
                            }),
                        })

                        if (!translationResponse.ok) {
                            const errorText = await translationResponse.text()
                            throw new Error(errorText)
                        }

                        if (!englishResponse.ok) {
                            const errorText = await englishResponse.text()
                            throw new Error(errorText)
                        }

                        // 선택 번역 언어
                        const { choices: transChoices } = await translationResponse.json()
                        const translatedText = transChoices[0].message.content.trim()

                        // 영어 번역 언어
                        const { choices: englishChoices } = await englishResponse.json()
                        const translatedEngText = englishChoices[0].message.content.trim()

                        // Supabase에 텍스트 저장
                        const isHost = userId == hostId

                        const { data, error } = await supabase
                            .from("messages")
                            .insert([
                                {
                                    speaker_id: userId,
                                    room_id: roomId,
                                    msg_content: isHost ? text : translatedText,
                                    msg_trans_content: isHost ? translatedText : text,
                                    msg_eng_content: translatedEngText,
                                },
                            ])
                            .select("*")

                        if (error) {
                            throw new Error(error.message)
                        }

                        // 로딩 완료 (녹음, 번역 완료)
                        if (data) {
                            setIsLoading(false)
                        }
                    } catch (error) {
                        console.error("Error uploading audio:", error)
                    }
                }

                mediaRecorder.start()
                mediaRecorderRef.current = mediaRecorder
            } catch (error) {
                console.error("Error accessing microphone:", error)
            }
        }
    }, [isRecording, userId, hostId, roomId, langCd, transLangCd])

    const stopRecording = useCallback(async () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop()
            setIsLoading(true)
        }
    }, [isRecording, userId, hostId, roomId, langCd, transLangCd])

    return { startRecording, stopRecording }
}
