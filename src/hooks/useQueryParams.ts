import { OptionProp } from "@app/setting/types"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

export const useQueryParams = () => {
    // Next 13 - 앱 라우터에서는 useRouter 대신 useSearchParams 사용
    const searchParams = useSearchParams()

    const params = useMemo(() => {
        const options = {} as OptionProp
        for (const [key, value] of searchParams.entries()) {
            options[key] = value
        }

        return options
    }, [searchParams])

    return params
}
