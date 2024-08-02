// hooks/useTranscriptions.ts
import { useState, useEffect, useRef } from "react"
import { supabase } from "@utils/superbase"
import { API } from "@resources/constant"

export function useTranscriptions({
    hostId,
    userId,
    roomId,
    display,
    langCd,
    transLangCd,
}: {
    hostId: string
    userId: string
    roomId: string
    display: number
    langCd: string
    transLangCd: string
}) {
    const [messages, setMessages] = useState<any[]>([]) // 채팅 메시지
    const [isRecording, setIsRecording] = useState(false) // 녹음 진행 여부
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false) // 로딩 표시 활성화

    // 타임아웃
    const [lastDataTime, setLastDataTime] = useState<number>(Date.now())

    useEffect(() => {
        // 채널 생성
        const channel = supabase
            .channel("realtime:messages")
            .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, payload => {
                console.log("Change received!", payload)
                setMessages(prevMessages => [...prevMessages, payload.new])
            })
            .subscribe()

        // 초기 데이터 로드
        const fetchMessages = async () => {
            const { data } = await supabase.from("messages").select("*").eq("room_id", roomId)
            setMessages(data || [])
        }

        fetchMessages()

        // 컴포넌트가 언마운트될 때 구독 해제
        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // 녹음 시작
    const startRecording = async () => {
        setIsLoading(true)

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                const mediaRecorder = new MediaRecorder(stream)

                setLastDataTime(Date.now())

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
                                        content: "You are a helpful assistant that translates text.",
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
                                        content: "You are a helpful assistant that translates text.",
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

                        // TODO 영어로 녹음된 경우
                        const isAlreadyTranslated = translatedEngText == "The text is already in English."

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
                                    msg_eng_content: isAlreadyTranslated ? text : translatedEngText,
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
                setIsRecording(true)
            } catch (error) {
                console.error("Error accessing microphone:", error)
            }
        }
    }

    // 녹음 중단
    const stopRecording = async () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }

    // [TO-BE] 주기적으로 음성이 감지되지 않는 시간 체크
    // [TO-BE] 4초 이상 음성이 감지되지 않으면 녹음 중단
    // 1초마다 체크
    useEffect(() => {
        if (isRecording) {
            const checkInactiveTime = () => {
                const currentTime = Date.now()

                console.log("currentTime:: ", currentTime)
                console.log("lastDataTime:: ", lastDataTime)

                //TODO : 현재로서 4초동안 녹음 후 중단
                //TODO : lastDataTime 업데이트 시점 미지정
                if (currentTime - lastDataTime > 4000) {
                    stopRecording()
                }
            }

            const interval = setInterval(checkInactiveTime, 1000)
            return () => clearInterval(interval)
        }
    }, [isRecording, lastDataTime])

    return {
        messages,
        isRecording,
        isLoading,
        startRecording,
        stopRecording,
    }
}
