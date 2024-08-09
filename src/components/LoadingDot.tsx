import cx from "classnames"
import "./style.scss"

const LoadingDot = ({ text, type }: { text?: string; type?: string }) => {
    return (
        <div className={cx("loading-wrap", type)}>
            <div className="loading dot">
                <div>Loading dot1</div>
                <div>Loading dot2</div>
                <div>Loading dot3</div>
            </div>
            <div className="loading text typo t14 w500">{text}</div>
        </div>
    )
}

export default LoadingDot
