import classNames from 'classnames/bind'
import styles from './Greeting.module.scss'
import rdvMainLogo from '~/assets/images/rdv_main-logo.svg'
import { useTranslation } from 'react-i18next'

const cx = classNames.bind(styles)

function Greeting({ hasContent = true, center = false }) {
    const { t } = useTranslation()
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header', center ? 'center' : '')}>
                <img src={rdvMainLogo} alt="" />
            </div>
            {hasContent && (
                <div className={cx('content')}>
                    <div className={cx('body')}>
                        <div className={cx('intro')}>
                            <p className={cx('title')}>{t('greeting')}</p>
                            <p className={cx('description')}>{t('guide')}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Greeting
