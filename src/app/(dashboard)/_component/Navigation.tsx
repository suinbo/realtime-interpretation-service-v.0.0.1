import cx from "classnames"
import { useRouter } from "next/navigation"
import "./style.scss"

const Navigation = ({ target, position }: { target: string; position: string }) => {
    const router = useRouter()

    return <div className={cx("navigation", position)} onClick={() => router.push(target)} />
}

export default Navigation
