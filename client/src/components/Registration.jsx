import React, { useState, useEffect } from 'react'
import '../styles/Registration.css'
import { useSelector, useDispatch } from 'react-redux'
// import { adminIsSet, setTokkenSlice } from '../../../redux/slices/AuthSlice'
import { adminIsSet, setTokkenSlice } from '../redux/slices/authSlice'
import { getRegisterAdmin, clearRegisterState } from '../redux/slices/getRegisterSlice'

import { useNavigate } from 'react-router-dom'
import { setShowMessage } from '../redux/slices/notificationSlice'


export default function Registration() {
    const dispatch = useDispatch()
    const registerState = useSelector(state => state.getRegisterSlice.registerState)
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
    })

    function onChangeHandler(e) {
        // setRegisterData(registerData => { ...registerData, [e.target.name: e.target.value] })
        if (e.target.name === 'firstName') {
            setRegisterData(registerData => ({ ...registerData, 'firstName': e.target.value }))
        } else if (e.target.name === 'lastName') {
            setRegisterData(registerData => ({ ...registerData, 'lastName': e.target.value }))
        } else if (e.target.name === 'email') {
            setRegisterData(registerData => ({ ...registerData, 'email': e.target.value }))
        } else if (e.target.name === 'password') {
            setRegisterData(registerData => ({ ...registerData, 'password': e.target.value }))
        } else if (e.target.name === 'phoneNumber') {
            setRegisterData(registerData => ({ ...registerData, 'phoneNumber': e.target.value }))
        }
    }
    useEffect(() => {
        if (registerState.message.result === 'success') {
            localStorage.setItem('isAdminRegister', true)
            dispatch(setShowMessage('Registered successfully'))
            dispatch(adminIsSet(true))
            dispatch(clearRegisterState())
            navigate('/login')
        }
    }, [registerState])
    function handleSubmit() {
        if (
            registerData.firstName.length > 0 &&
            registerData.lastName.length > 0 &&
            registerData.email.length > 0 &&
            registerData.password.length > 0 &&
            registerData.password.length > 0) {
            dispatch(getRegisterAdmin(registerData))
        } else {
            dispatch(setShowMessage('Please fill all the field'))
        }
    }

    return (
        <main className='container'>
            <div className='min-vh-100 d-flex flex-column align-items-center justify-content-center'>
                <section className='col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center'>

                    <h4 className='p-0 m-0'>
                        <strong>RBAC</strong>
                    </h4>
                    <div className='mainDivRegister mt-3 bg-white p-4'>
                        <h5 className='text-center'>Registration</h5>
                        <section>
                            <label htmlFor="firstName">First Name </label>
                            <input className='myInput' onChange={(e) => { onChangeHandler(e) }} type="text" id='firstName' name="firstName" />
                        </section>
                        <section>
                            <label htmlFor="lastName">Last Name </label>
                            <input className='myInput' onChange={(e) => { onChangeHandler(e) }} type="text" id='lastName' name="lastName" />
                        </section>
                        <section>
                            <label htmlFor="email">Email </label>
                            <input className='myInput' onChange={(e) => { onChangeHandler(e) }} type="text" id='email' name="email" />
                        </section>
                        <section>
                            <label htmlFor="password">Password </label>
                            <input className='myInput' onChange={(e) => { onChangeHandler(e) }} type="password" id='password' name="password" />
                        </section>
                        <section>
                            <label htmlFor="phoneNumber">Phone Number </label>
                            <input className='myInput' onChange={(e) => { onChangeHandler(e) }} type="number" id='phoneNumber' name="phoneNumber" />
                        </section>
                        {/* <section>
                            <label htmlFor="confirmPassword">Confirm Password </label>
                            <input className='myInput' onChange={(e) => { onChangeHandler(e) }} type="password" id='confirmPassword' name="confirmPassword" />
                        </section> */}
                        <section>
                            <button className='myBtn py-1' onClick={handleSubmit} type='button'>Register</button>
                        </section>
                    </div>
                </section>
            </div>

        </main>
    )
}
