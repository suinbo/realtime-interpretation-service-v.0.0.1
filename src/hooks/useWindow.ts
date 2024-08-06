import { useEffect, useState } from "react"

const useWindow = () => {
    const [url, setUrl] = useState<string>("")

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUrl(window.location.href)
        }
    }, [])

    return { url }
}

export default useWindow
