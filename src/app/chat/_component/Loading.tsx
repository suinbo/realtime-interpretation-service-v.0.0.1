import cx from "classnames"
import "./style.scss"

const Loading = ({ whiteMode = false }: { whiteMode?: boolean }) => {
    return (
        <div className={cx("loading-wrap", { whiteMode })}>
            <div className="loading dot">
                <div>Loading dot1</div>
                <div>Loading dot2</div>
                <div>Loading dot3</div>
            </div>
        </div>
    )
}

export default Loading
