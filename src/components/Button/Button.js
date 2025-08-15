import classNames from 'classnames/bind'
import styles from './Button.module.scss'

const cx = classNames.bind(styles)

function Button({ title, type, onClick, className, disabled = false }) {
    return (
        <button className={cx('btn', type, className)} onClick={onClick} disabled={disabled}>
            {title}
        </button>
    )
}

export default Button
