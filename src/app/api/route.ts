import { supabase } from "@utils/superbase"
import { NextResponse } from "next/server"

/**
 * @ERROR dynamic = "error"
 * @description cookies와 같은 서버 전용 기능을 사용하는 경우, 페이지를 정적으로 렌더링할 수 없음 => 동적 렌더링 되어야 함
 * @description API Route를 통해 서버에서 데이터를 처리 => 클라이언트에서 데이터를 동적으로 로드 (API 호출)
 */
export async function GET() {
    try {
        const { data: messages, error } = await supabase.from("messages").select()

        if (error) {
            throw new Error(error.message)
        }

        return NextResponse.json(messages)
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
