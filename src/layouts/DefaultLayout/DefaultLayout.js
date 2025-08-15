import classNames from 'classnames/bind'
import styles from './DefaultLayout.module.scss'
import MainLeft from '~/layouts/MainLeft/MainLeft'
import MainRight from '../MainRight/MainRight'

const cx = classNames.bind(styles)

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <MainLeft />
            <MainRight>{children}</MainRight>
        </div>
    )
}

export default DefaultLayout
