import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from '~/assets/icons/icon'
import classNames from 'classnames/bind'
import styles from './MultiSelect.module.scss'
import { useTranslation } from 'react-i18next'
import { Tick } from '../../../assets/icons/icon'

const cx = classNames.bind(styles)

function MultiSelect({ title, placeholder, options, selectedOptions, setSelectedOptions }) {
    const dropdownRef = useRef(null)
    const { t, i18n } = useTranslation()
    const language = i18n.language
    const [open, setOpen] = useState(false)

    const toggleSelect = (option) => {
        setSelectedOptions((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
        )
    }
    const handleRemoveOption = (option) => {
        setSelectedOptions((prev) => prev.filter((item) => item !== option))
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    })
    return (
        <div className={cx('select-wrapper')}>
            <div className={cx('select-title')}>
                {open && language === 'vi' ? `Hãy ${title.charAt(0).toLowerCase() + title.slice(1)}` : title}
            </div>
            <div className={cx('select-container')} ref={dropdownRef}>
                <div className={cx('selector')} onClick={() => setOpen((prev) => !prev)}>
                    {selectedOptions?.length > 0 ? (
                        <div className={cx('selected-options-wrapper')}>
                            {selectedOptions?.map((option) => (
                                <div className={cx('selected-option')} key={option.id}>
                                    <span
                                        className={cx('remove-icon')}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemoveOption(option)
                                        }}
                                    >
                                        x
                                    </span>
                                    {option.name}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className={cx('select-placeholder')}>{placeholder}</span>
                    )}
                    <ArrowDown width="12" height="8" className={`arrow-icon ${open ? 'active' : ''}`} />
                </div>

                <div className={cx('select-dropdown', open ? 'active' : '')}>
                    <span className={cx('not-select')}>
                        {language === 'vi' ? `Hãy ${title.charAt(0).toLowerCase() + title.slice(1)}` : title}
                    </span>
                    {options?.map((option) => (
                        <div className={cx('select-option')} key={option.id} onClick={() => toggleSelect(option)}>
                            {t(option.name)}
                            {selectedOptions.includes(option) && <Tick width="12" height="12" />}
                        </div>
                    ))}
                </div>

                {open && <div className={cx('overlay')} onClick={() => setOpen(false)}></div>}
            </div>
        </div>
    )
}

export default MultiSelect
