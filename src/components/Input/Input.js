import classNames from 'classnames/bind'
import styles from './Input.module.scss'

const cx = classNames.bind(styles)

function Input({ type, id, name, value = '', onChange, required = false, placeholder }) {
    return (
        <input
            className={cx('input')}
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
        />
    )
}

export default Input
