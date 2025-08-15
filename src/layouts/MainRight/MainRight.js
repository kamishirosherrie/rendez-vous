import classNames from 'classnames/bind'
import styles from './MainRight.module.scss'
import { useStep } from '~/contexts/stepContext'

const cx = classNames.bind(styles)

function MainRight({ children }) {
    const { step } = useStep()
    return <div className={cx('wrapper', { 'white-bgr': step > 1 })}>{children}</div>
}

export default MainRight
