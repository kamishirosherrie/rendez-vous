import { useEffect, useState } from 'react'

import MultiSelect from '~/components/Select/MultiSelect/MultiSelect'
import RangeTimePicker from '~/components/RangeTimePicker/RangeTimePicker'
import dayjs from 'dayjs'
import LanguageSelection from '~/components/LanguageSelection/LanguageSelection'
import Greeting from '~/components/Greeting/Greeting'
import classNames from 'classnames/bind'
import styles from './Home.module.scss'
import Input from '~/components/Input/Input'
import Button from '~/components/Button/Button'
import DatePicker from '~/components/DatePicker/DatePicker'
import { customerSchema } from '~/validations/formSchema'
import { useStep } from '../../contexts/stepContext'
import { useTranslation } from 'react-i18next'

const cx = classNames.bind(styles)

const serviceOptions = [
    {
        value: 'service1',
        label: 'Khám phá BST mới',
    },
    {
        value: 'service2',
        label: 'Đặt mua sản phẩm',
    },
    {
        value: 'service3',
        label: 'Tư vấn quà tặng',
    },
    {
        value: 'service4',
        label: 'Hậu mãi và bảo trì sản phẩm',
    },
]
const catalogOptions = [
    { value: 'category1', label: 'Đồng hồ và trang sức' },
    { value: 'category2', label: 'Thời trang' },
    { value: 'category3', label: 'Phong cách sống' },
    { value: 'category4', label: 'Mỹ phẩm' },
]

function Home() {
    const { t } = useTranslation()
    const { step, setStep } = useStep()
    const [customer, setCustomer] = useState({})
    const [selectedservice, setSelectedService] = useState([])
    const [selectedCatalog, setSelectedCatalog] = useState([])
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedRangeTime, setSelectedRangeTime] = useState(null)
    const [rangeTimesAvailable, setRangeTimesAvailable] = useState([])
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [isEmailCheck, setIsEmailCheck] = useState(false)
    const [isSMSCheck, setIsSMSCheck] = useState(false)
    const [isSubscribe, setIsSubscribe] = useState(false)

    const nextStep = async () => {
        setStep((prev) => prev + 1)
    }
    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1))
    }

    const handleChangeCustomer = (e) => {
        const { name, value } = e.target
        setCustomer((prev) => ({ ...prev, [name]: value }))
    }

    const toggleEmail = () => {
        setIsEmailCheck((prev) => !prev)
    }

    const toggleSMS = () => {
        setIsSMSCheck((prev) => !prev)
    }

    const isStepValid = () => {
        if (step === 2) {
            return customerSchema.isValidSync(customer)
        }
        if (step === 3) {
            return selectedservice.length > 0 && selectedCatalog.length > 0
        }
        if (step === 4) {
            return selectedDate && selectedRangeTime
        }
        if (step === 5) {
            return (isEmailCheck || isSMSCheck) && isSubscribe
        }
        return false
    }

    const handleSubmit = () => {
        nextStep()
        const formValues = {
            ...customer,
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email,
            phone_number: customer.phone_number,
            services: selectedservice,
            catalogs: selectedCatalog,
            date: selectedDate?.toISOString(),
            time: selectedRangeTime,
            chanel: {
                email: isEmailCheck,
                sms: isSMSCheck,
            },
            isSubscribe: isSubscribe,
        }
        console.log(formValues)
    }

    useEffect(() => {
        if (selectedDate) {
            // Fetch range times based on selected date
            const rangeTimes = [
                { start: '8:00', end: '9:00' },
                { start: '10:00', end: '11:00' },
                { start: '16:00', end: '17:00' },
                { start: '17:00', end: '18:00' },
                { start: '20:00', end: '21:00' },
                { start: '21:00', end: '22:00' },
            ]
            setRangeTimesAvailable(rangeTimes)
        }
    }, [selectedDate])

    return (
        <>
            {step === 1 && <LanguageSelection nextStep={nextStep} />}
            {step === 2 && (
                <div className={cx('step')}>
                    <Greeting />
                    <div className={cx('form')}>
                        <div className={cx('input-group')}>
                            <div className={cx('input')}>
                                <Input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={customer.first_name}
                                    onChange={handleChangeCustomer}
                                    required
                                    placeholder={t('surName')}
                                />
                            </div>
                            <div className={cx('input')}>
                                <Input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={customer.last_name}
                                    onChange={handleChangeCustomer}
                                    required
                                    placeholder={t('name')}
                                />
                            </div>
                        </div>
                        <div className={cx('input-group')}>
                            <div className={cx('input')}>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={customer.email}
                                    onChange={handleChangeCustomer}
                                    required
                                    placeholder="Email"
                                />
                            </div>
                        </div>
                        <div className={cx('input-group', 'has-label')}>
                            <Input
                                type="text"
                                id="phone_number"
                                name="phone_number"
                                value={customer.phone_number}
                                onChange={handleChangeCustomer}
                                required
                                placeholder={t('phoneNumber')}
                            />
                            <label htmlFor="phone_number" className={cx('note')}>
                                {t('phoneNumberNote')}
                            </label>
                        </div>
                        <div className={cx('action')}>
                            <Button
                                type="primary"
                                className={cx('btn-primary', 'single')}
                                onClick={nextStep}
                                title={t('next')}
                                disabled={!isStepValid()}
                            />
                        </div>
                    </div>
                    <div className={cx('footer')}>Since 2025</div>
                </div>
            )}
            {step === 3 && (
                <div className={cx('step')}>
                    <Greeting />
                    <div className={cx('form')}>
                        <div className={cx('input')}>
                            <MultiSelect
                                title={t('serviceSelection')}
                                options={serviceOptions}
                                selectedOptions={selectedservice}
                                setSelectedOptions={setSelectedService}
                                placeholder={t('serviceSlectionPlaceholder')}
                            />
                        </div>
                        <div className={cx('input')}>
                            <MultiSelect
                                title={t('catalogSelection')}
                                options={catalogOptions}
                                selectedOptions={selectedCatalog}
                                setSelectedOptions={setSelectedCatalog}
                                placeholder={t('catalogSelectionPlaceholder')}
                            />
                        </div>
                        <div className={cx('action')}>
                            <Button type="default" className={cx('btn-default')} onClick={prevStep} title={t('back')} />
                            <Button
                                type="primary"
                                className={cx('btn-primary')}
                                disabled={!isStepValid()}
                                onClick={nextStep}
                                title={t('next')}
                            />
                        </div>
                    </div>
                    <div className={cx('footer')}>Since 2025</div>
                </div>
            )}
            {step === 4 && (
                <div className={cx('step')}>
                    <Greeting />
                    <div className={cx('form')}>
                        <div className={cx('date-picker-wrapper')}>
                            <DatePicker
                                title={t('pickADate')}
                                showDatePicker={showDatePicker}
                                setShowDatePicker={setShowDatePicker}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                            />
                            <RangeTimePicker
                                title={t('timePeriod')}
                                placeholder={t('fromTime', { start: '___' }) + ' ' + t('endTime', { end: '___' })}
                                selectedOption={selectedRangeTime}
                                setSelectedOption={setSelectedRangeTime}
                                availableTimes={rangeTimesAvailable}
                                isDisabled={!selectedDate}
                            />
                        </div>
                        <div className={cx('action')}>
                            <Button type="default" className={cx('btn-default')} onClick={prevStep} title={t('back')} />
                            <Button
                                type="primary"
                                className={cx('btn-primary')}
                                disabled={!isStepValid()}
                                onClick={nextStep}
                                title={t('next')}
                            />
                        </div>
                    </div>
                    <div className={cx('footer')}>Since 2025</div>
                </div>
            )}
            {step === 5 && (
                <div className={cx('step')}>
                    <Greeting hasContent={false} />
                    <div className={cx('form')}>
                        <p className={cx('heading-title')}>{t('appointmentInformation')}</p>
                        <div className={cx('form-info')}>
                            <p>
                                <span>{t('fullName')}:</span>
                                <span>{customer?.first_name + ' ' + customer?.last_name}</span>
                            </p>
                            <p>
                                <span>Email:</span>
                                <span>{customer?.email}</span>
                            </p>
                            <p>
                                <span>{t('phoneNumber')}:</span>
                                <span>{customer?.phone_number}</span>
                            </p>
                        </div>
                        <div className={cx('form-info')}>
                            <p>
                                <span>{t('services')}</span>
                                <span>{selectedservice?.map((item) => item.label).join(', ')}</span>
                            </p>
                            <p>
                                <span>{t('categories')}</span>
                                <span>{selectedCatalog?.map((item) => item.label).join(', ')}</span>
                            </p>
                        </div>
                        <div className={cx('form-info')}>
                            <p>
                                <span>{t('scheduledDate')}</span>
                                <span>{dayjs(selectedDate).format('DD.MM.YYYY')}</span>
                            </p>
                            <p>
                                <span>{t('scheduledTime')}</span>
                                <span>
                                    {t('fromTime', { start: selectedRangeTime?.start })}{' '}
                                    {t('endTime', { end: selectedRangeTime?.end })}
                                </span>
                            </p>
                        </div>
                        <div className={cx('chanel')}>
                            <p>{t('chanel')}</p>
                            <Button
                                type="bordered"
                                title="Email"
                                className={cx(isEmailCheck ? 'active' : '')}
                                onClick={toggleEmail}
                            />
                            <Button
                                type="bordered"
                                title="SMS"
                                className={cx(isSMSCheck ? 'active' : '')}
                                onClick={toggleSMS}
                            />
                        </div>
                        <div className={cx('terms')}>
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                onChange={(e) => setIsSubscribe(e.target.checked)}
                            />
                            <span className={cx('checkmark')}></span>
                            <label htmlFor="terms">{t('policy')}</label>
                        </div>
                        <div className={cx('action')}>
                            <Button type="default" className={cx('btn-default')} onClick={prevStep} title={t('back')} />
                            <Button
                                type="primary"
                                className={cx('btn-primary', 'fit-content')}
                                onClick={handleSubmit}
                                disabled={!isStepValid()}
                                title={t('finish')}
                            />
                        </div>
                    </div>
                    <div className={cx('footer')}>Since 2025</div>
                </div>
            )}
            {step === 6 && (
                <div className={cx('step', 'center')}>
                    <Greeting hasContent={false} center={true} />
                    <div className={cx('thanks')}>
                        <p>{t('thanks')}</p>
                    </div>
                    <div className={cx('footer')}>Since 2025</div>
                </div>
            )}
        </>
    )
}

export default Home
