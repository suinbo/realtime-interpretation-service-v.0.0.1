// app/api/whisper/route.ts
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const formData = await request.formData()
    const file = formData.get("file") as File

    // Whisper API 호출
    const response = await fetch("https://api.lemonfox.ai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_WHISPER_API_KEY}`,
            // "Content-Type": "audio/mpeg",
        },
        body: file,
    })

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 })
    }

    const data = await response.json()
    const text = data.text

    return NextResponse.json({ text })
}
