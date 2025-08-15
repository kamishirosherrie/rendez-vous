import classNames from 'classnames/bind'
import styles from './MainLeft.module.scss'
import homepageImg from '~/assets/images/homepage.png'

const cx = classNames.bind(styles)

function MainLeft() {
    return (
        <div className={cx('wrapper')}>
            <img src={homepageImg} alt="" />
        </div>
    )
}

export default MainLeft
