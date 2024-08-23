import "./styles.scss"

const FormItem = ({ id, title, element }: { id?: string; title: string; element: React.ReactNode }) => {
    return (
        <div className={`form__item${id ? `--${id}` : ""}`}>
            <p className="typo t16 w500">{title}</p>
            {element}
        </div>
    )
}

export default FormItem
