import { COOKIE_DOMAIN } from "@resources/constant"
import { isInternetExplorer } from "./common"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    keys: {
        expireTime: "expireTime",
        credential: "credential",
    },
    getItem(key: string) {
        const result = decodeURIComponent(
            parent.document.cookie.replace(
                new RegExp(
                    "(?:(?:^|.*;)\\s*" +
                        encodeURIComponent(key).replace(/[-.+*]/g, "\\$&") +
                        "\\s*\\=\\s*([^;]*).*$)|^.*$"
                ),
                "$1"
            )
        )
        return result || null
    },
    setItem({
        key,
        value,
        expire,
        domain = COOKIE_DOMAIN,
        path = "/",
        secure,
    }: {
        key: string
        value: string
        expire?: string
        domain?: string
        path?: string
        secure?: string
    }) {
        if (!key || /^(?:expires|max-age|path|domain|secure)$/i.test(key)) {
            return false
        }

        const now = new Date()
        now.setDate(now.getDate() + 1)

        const cookieData = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; expires=${
            expire && now.toUTCString()
        }; path=${path}; ${secure ? "secure=" + secure : ""}; SameSite=lax ${
            !isInternetExplorer() || domain ? "; domain=" + domain : ""
        }`

        parent.document.cookie = cookieData

        return true
    },
    removeItem(key: string) {
        parent.document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
    },

    hasItem(key: string) {
        return new RegExp("(?:^|;\\s*)" + encodeURIComponent(key).replace(/[-.+*]/g, "\\$&") + "\\s*\\=").test(
            parent.document.cookie
        )
    },

    clear() {
        const nameList = parent.document.cookie
            .replace(/((?:^|\s*;)[^=]+(?:(?:=([^;]*))|$))|^\s*|\s*(?:=[^;]*)?/g, "")
            .split(/\s*(?:=[^;]*)?;\s*/)
        nameList.forEach(name => {
            if (/^_ga.*/gi.test(name) !== true) this.removeItem(decodeURIComponent(name))
        })
    },
}
