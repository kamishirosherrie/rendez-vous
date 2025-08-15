import * as yup from 'yup'

export const customerSchema = yup.object().shape({
    first_name: yup.string().required('Vui lòng nhập thông tin'),
    last_name: yup.string().required('Vui lòng nhập thông tin'),
    email: yup
        .string()
        .required('Vui lòng nhập email')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ'),
    phone_number: yup
        .string()
        .required('Vui lòng nhập sốđiện thoại')
        .matches(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
})
