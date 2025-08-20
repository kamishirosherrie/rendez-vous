import classNames from 'classnames/bind'
import styles from './DatePicker.module.scss'
import './DayPicker.scss'
import { DayPicker } from 'react-day-picker'
import dayjs from 'dayjs'
import { ArrowDown } from '~/assets/icons/icon'
import { useEffect, useRef } from 'react'

const cx = classNames.bind(styles)

function DatePicker({ showDatePicker, setShowDatePicker, selectedDate, onClick, title }) {
    const dropdownRef = useRef(null)

    const handleChange = (date) => {
        onClick?.(date)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDatePicker(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    })
    return (
        <div className={cx('wrapper')}>
            <label>{title}</label>
            <div className={cx('container')} ref={dropdownRef}>
                <div className={cx('selector')} onClick={() => setShowDatePicker((prev) => !prev)}>
                    {selectedDate ? (
                        <span>{dayjs(selectedDate).format('DD.MM.YYYY')}</span>
                    ) : (
                        <span className={cx('placeholder')}>dd/mm/yyyy</span>
                    )}
                    <ArrowDown width="12" height="8" className={cx('arrow-icon', showDatePicker ? 'active' : '')} />
                </div>
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleChange}
                    showOutsideDays
                    weekStartsOn={1}
                    disabled={[
                        {
                            before: new Date(),
                        },
                        {
                            from: new Date(),
                            to: new Date().setDate(new Date().getDate() + 2),
                        },
                        {
                            dayOfWeek: [0, 6],
                        },
                    ]}
                    className={`day-picker ${showDatePicker ? 'active' : ''}`}
                />
                {showDatePicker && <div className={cx('overlay')} onClick={() => setShowDatePicker(false)}></div>}
            </div>
        </div>
    )
}

export default DatePicker
