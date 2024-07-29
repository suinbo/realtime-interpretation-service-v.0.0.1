// hooks/useTranscriptions.ts
import { useState, useEffect, useRef } from "react"
import { supabase } from "@utils/superbase"
import { API } from "@resources/constant"

export function useTranscriptions() {
    const [messages, setMessages] = useState<any[]>([])
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)

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
            const { data } = await supabase.from("messages").select("*")
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
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                const mediaRecorder = new MediaRecorder(stream)

                let audioChunks: Blob[] = []
                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        // 음성 데이터 도착하면 타이머 초기화
                        setLastDataTime(Date.now())
                        audioChunks.push(event.data)
                    }
                }

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
                    const formData = new FormData()
                    formData.append("file", audioBlob, "audio.webm")
                    formData.append("language", "korean")
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

                        // Supabase에 텍스트 저장
                        const { data, error } = await supabase.from("messages").insert([{ content: text }])

                        if (error) {
                            throw new Error(error.message)
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

    // 주기적으로 음성이 감지되지 않는 시간 체크
    useEffect(() => {
        const checkInactiveTime = () => {
            const currentTime = Date.now()

            // 5초 이상 음성이 감지되지 않으면 녹음 중단
            if (isRecording && currentTime - lastDataTime > 5000) {
                stopRecording()
            }
        }

        // 1초마다 체크
        const interval = setInterval(checkInactiveTime, 5000)
        return () => clearInterval(interval)
    }, [isRecording, lastDataTime])

    return {
        messages,
        isRecording,
        startRecording,
        stopRecording,
    }
}
