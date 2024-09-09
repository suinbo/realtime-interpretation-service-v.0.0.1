import { API } from "@resources/constant"
import type { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"

async function readStreamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let result = ""
    let done = false

    while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        result += decoder.decode(value, { stream: !done })
    }

    return result
}

// Function to parse URL-encoded data
function parseUrlEncodedData(urlEncodedString: string): Record<string, string> {
    return urlEncodedString
        .split("&")
        .map(pair => pair.split("="))
        .reduce((acc, [key, value]) => {
            acc[decodeURIComponent(key)] = decodeURIComponent(value || "")
            return acc
        }, {} as Record<string, string>)
}

// naver auth API CORS 이슈 방지위해 내부 API 사용
export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const bodyString = await readStreamToString(req.body!)

    // Parse the URL-encoded body
    const parsedBody = parseUrlEncodedData(bodyString)

    // Extract code and state from the parsed body
    const code = parsedBody["code"]
    const state = parsedBody["state"]

    if (!code || !state) {
        return NextResponse.json({ error: "Code and state are required" }, { status: 400 })
    }

    try {
        const response = await fetch(API.POST_TOKEN, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
                client_secret: process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET!,
                code,
                state,
            }).toString(),
        })

        const data = await response.json()
        const accessToken = data.access_token

        const userInfoResponse = await fetch(API.GET_USER, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        const userInfo = await userInfoResponse.json()
        return NextResponse.json(userInfo.response, { status: 200 })
    } catch (error) {
        console.error("Error fetching Naver token:", error)
        return NextResponse.json({ error: "Failed to fetch Naver token" }, { status: 500 })
    }
}
