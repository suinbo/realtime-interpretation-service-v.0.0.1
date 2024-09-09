import { isMobileDevice } from "@utils/common"

export const FLAG = { Y: "Y", N: "N" }

export const MIN_BLOB_SIZE = isMobileDevice() ? 1500 : 3000

export const VIEW = {
    LANGUAGE: "language" as const,
    DISPLAY: "display" as const,
    CAHTTING: "chatting" as const,
}

export const NAV = {
    NEXT: "Next" as const,
    PREVIOUS: "Previous" as const,
}

export const STEP = {
    1: "step-1" as const,
    2: "step-2" as const,
}

export const API = {
    WHISPER_API: "https://api.openai.com/v1/audio/transcriptions",
    TRANSLATION_API: "https://api.openai.com/v1/chat/completions",
    POST_TOKEN: "https://nid.naver.com/oauth2.0/token",
    GET_USER: "https://openapi.naver.com/v1/nid/me",
}

export const REDIRECT_URL = {
    GOOGLE: "https://kznbsxjbhmrmoiflpupl.supabase.co/auth/v1/callback",
    NAVER: "http://localhost:3000/api/auth/callback/naver",
}

export const COOKIE_DOMAIN =
    typeof window !== "undefined" ? window.location.hostname.replace("www.", "") : "default.domain.com"

export const TRANS_MESSAGE = {
    EMPTY: "empty_record" as const,
}
