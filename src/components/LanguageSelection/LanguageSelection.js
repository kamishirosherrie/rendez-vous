import classNames from 'classnames/bind'
import styles from './LanguageSelection.module.scss'
import logo from '~/assets/images/rdv_logo.svg'
import logoMobile from '~/assets/images/rdv_logo-mobile.svg'
import Button from '~/components/Button/Button'
import { useStep } from '~/contexts/stepContext'
import i18n from '../../i18n'

const cx = classNames.bind(styles)

function LanguageSelection({ nextStep }) {
    const { step } = useStep()
    return (
        <div className={cx('wrapper')}>
            <img src={logo} className={cx('logo-desktop')} alt="" />
            <img src={logoMobile} className={cx('logo-mobile')} alt="" />
            <div className={cx('language-btn')}>
                <Button
                    type="primary"
                    className={cx({ 'btn-homepage': step === 1 })}
                    title="Tiếng Việt"
                    onClick={() => {
                        nextStep()
                        i18n.changeLanguage('vi')
                    }}
                />
                <Button
                    type="secondary"
                    className={cx({ 'btn-homepage': step === 1 })}
                    title="English"
                    onClick={() => {
                        nextStep()
                        i18n.changeLanguage('en')
                    }}
                />
            </div>
        </div>
    )
}

export default LanguageSelection
