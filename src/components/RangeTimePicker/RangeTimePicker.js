import classNames from 'classnames/bind'
import style from './RangeTimePicker.module.scss'
import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from '~/assets/icons/icon'
import { useTranslation } from 'react-i18next'

const cx = classNames.bind(style)

function RangeTimePicker({
    title,
    placeholder,
    availableTimes,
    selectedOption,
    setSelectedOption,
    isDisabled = false,
}) {
    const dropdownRef = useRef(null)

    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const rangeTimes = [
        { start: '08:00', end: '09:00' },
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
        { start: '16:00', end: '17:00' },
        { start: '17:00', end: '18:00' },
        { start: '18:00', end: '19:00' },
        { start: '19:00', end: '20:00' },
        { start: '20:00', end: '21:00' },
        { start: '21:00', end: '22:00' },
    ]

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
        <div className={cx('wrapper')}>
            <div className={cx('title')}>{title}</div>
            <div className={cx('container')} ref={dropdownRef}>
                <div
                    className={cx('selector', { disabled: isDisabled })}
                    onClick={() => {
                        if (!isDisabled) {
                            setOpen((prev) => !prev)
                        }
                    }}
                >
                    {selectedOption ? (
                        <div className={cx('selected-range-time')}>
                            <span>{t('fromTime', { start: selectedOption.start })}</span>
                            <span>{t('endTime', { end: selectedOption.end })}</span>
                        </div>
                    ) : (
                        <span className={cx('placeholder')}>{placeholder}</span>
                    )}
                    <ArrowDown width="12" height="8" className={cx('arrow-icon', open ? 'active' : '')} />
                </div>

                <div className={cx('dropdown', open ? 'active' : '')}>
                    {rangeTimes?.map((range, index) => {
                        const isAvailable = availableTimes?.some(
                            (time) => time.time === range.start && time.end_time === range.end,
                        )
                        return (
                            <div
                                className={cx('option', { disabled: !isAvailable })}
                                key={index}
                                onClick={() => {
                                    isAvailable && setSelectedOption(range)
                                }}
                            >
                                {range.start} - {range.end}
                            </div>
                        )
                    })}
                </div>

                {open && <div className={cx('overlay')} onClick={() => setOpen(false)}></div>}
            </div>
        </div>
    )
}

export default RangeTimePicker
