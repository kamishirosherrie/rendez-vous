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
import axios from 'axios'

const cx = classNames.bind(styles)

function formatDate(date, time) {
    const [h, m] = time.split(':').map(Number)
    return dayjs(date).hour(h).minute(m).second(0).format('YYYY-MM-DD HH:mm:ss')
}

function Home() {
    const { t, i18n } = useTranslation()
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

    const [services, setServices] = useState([])
    const [categories, setCategories] = useState([])

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

    const handleChangeDate = async (date) => {
        setSelectedDate(date)
        if (date) {
            const dateConverted = date.toISOString().split('T')[0]
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/available-times?date=${dateConverted}`)
            setRangeTimesAvailable(response.data?.data?.available_times ?? [])
        }
    }

    const handleSubmit = async () => {
        nextStep()
        const serviceIds = selectedservice.map((item) => item.id)
        const catalogIds = selectedCatalog.map((item) => item.id)
        const formValues = {
            ...customer,
            customer_firstname: customer.first_name,
            customer_lastname: customer.last_name,
            customer_email: customer.email,
            customer_phone: customer.phone_number,
            customer_language: i18n.language,
            service_id: serviceIds,
            product_category_id: catalogIds,
            appointment_date: formatDate(selectedDate, selectedRangeTime.start),
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/appointments`, formValues)
            console.log('Appointment created successfully: ', response.data)
        } catch (error) {
            console.error('Error creating appointment: ', error)
        }
    }

    useEffect(() => {
        async function fetchServicesAndCatalogs() {
            if (step === 3) {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/services-categories`)
                console.log(response.data.data)
                setServices(response.data?.data?.services ?? [])
                setCategories(response.data?.data?.product_categories ?? [])
            }
        }
        fetchServicesAndCatalogs()
    }, [step])

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
                                options={services}
                                selectedOptions={selectedservice}
                                setSelectedOptions={setSelectedService}
                                placeholder={t('serviceSlectionPlaceholder')}
                            />
                        </div>
                        <div className={cx('input')}>
                            <MultiSelect
                                title={t('categorySelection')}
                                options={categories}
                                selectedOptions={selectedCatalog}
                                setSelectedOptions={setSelectedCatalog}
                                placeholder={t('categorySelectionPlaceholder')}
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
                                onClick={handleChangeDate}
                                selectedDate={selectedDate}
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
