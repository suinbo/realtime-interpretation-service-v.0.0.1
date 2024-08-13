import { API } from "@resources/constant"
import { supabase } from "@utils/superbase"
import { useState, useCallback, useRef } from "react"

function useTranscriptionsOfSingle({
    hostId,
    userId,
    roomId,
    langCd,
    transLangCd,
    isRecording,
}: {
    hostId: string
    userId: string | null
    roomId: string
    langCd: string
    transLangCd: string
    isRecording: boolean
}) {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false) // 로딩 표시 활성화

    // 녹음 시작
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
                    const formData = new FormData()
                    formData.append("file", audioBlob, "audio.webm")
                    formData.append("language", langCd)
                    formData.append("response_format", "json")

                    try {
                        const response = await fetch(API.WHISPER_API, {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_WHISPER_API_KEY}`,
                            },
                            body: formData,
                        })

                        if (!response.ok) {
                            const errorText = await response.text()
                            throw new Error(errorText)
                        }

                        const { text } = await response.json()

                        // 3. 영어 번역 API 호출
                        const englishResponse = await fetch(API.GPT_TRANSLATION_API, {
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
                        const translationResponse = await fetch(API.GPT_TRANSLATION_API, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                            },
                            body: JSON.stringify({
                                model: "gpt-4",
                                // prompt: `Translate this text to English: ${text}`,
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

                        console.log("Data inserted into Supabase:", data)
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

    // 녹음 중단
    const stopRecording = useCallback(async () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop()
            setIsLoading(true)
        }
    }, [isRecording, userId, hostId, roomId, langCd, transLangCd])

    return {
        isLoading,
        startRecording,
        stopRecording,
    }
}

export default useTranscriptionsOfSingle
