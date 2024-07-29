import { LabelOfStepProp } from "@app/setting/types"

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

// 스텝 별 라벨
export const labelOfStep: LabelOfStepProp = {
    [STEP[1]]: {
        nav: NAV.NEXT,
        title: "대화 설정",
    },
    [STEP[2]]: {
        nav: NAV.PREVIOUS,
        title: "오디오 설정",
    },
}

export const API = {
    WHISPER_API: "https://api.lemonfox.ai/v1/audio/transcriptions",
    GPT_TRANSLATION_API: "https://api.openai.com/v1/chat/completions",
}
