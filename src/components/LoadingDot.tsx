import "./style.scss"

const LoadingDot = ({ text }: { text?: string }) => {
    return (
        <div className="loading-wrap">
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
