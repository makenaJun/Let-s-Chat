import React, { useState } from 'react'
import { useFormik } from 'formik';
import styles from '../App.module.css';
import logo from '../img/logo.png';
import * as Yup from 'yup';
import axios from 'axios';

export const ConnectPage = (props) => {

    const { onLogin } = props;
    const [isLoading, setIsLoading] = useState(false);

    const connectSchema = Yup.object().shape({
        'roomId': Yup.string().max(10, 'Max 10 symbols').required('Field is required'),
        'userName': Yup.string().max(15, 'Max 15 symbols').required('Field is required')
    })

    const formConnect = useFormik({
        initialValues: {
            'roomId': '',
            'userName': ''
        },
        onSubmit: async (formData) => {
            setIsLoading(true);
            await axios.post('/rooms', { ...formData });
            onLogin(formData);
        },
        validationSchema: connectSchema
    });

    return (<>
            <img className={styles.logo} src={logo} alt={'Logo'} />

            <form onSubmit={formConnect.handleSubmit} className={styles.form}>
                <div className={styles.wrapInputAndError}>
                    <input className={formConnect.errors.roomId ? styles.errorInput : styles.input}
                        type={'text'}
                        placeholder={'Enter room id'}
                        name={'roomId'}
                        onChange={formConnect.handleChange}
                        onBlur={formConnect.handleBlur}
                        value={formConnect.values.roomId}
                    />
                    {formConnect.errors.roomId && formConnect.touched.roomId && <span className={styles.error}>{formConnect.errors.roomId}</span>}
                </div>
                <div className={styles.wrapInputAndError}>
                    <input className={formConnect.errors.userName ? styles.errorInput : styles.input}
                        type={'text'}
                        placeholder={'Enter user name'}
                        name={'userName'}
                        onChange={formConnect.handleChange}
                        onBlur={formConnect.handleBlur}
                        value={formConnect.values.userName}
                    />
                    {formConnect.errors.userName && formConnect.touched.userName && <span className={styles.error}>{formConnect.errors.userName}</span>}
                </div>
                <button className={styles.button} disabled={isLoading} type="submit">{!isLoading ? 'Connect' : '...Connection'}</button>
            </form>
        </>
    )
};