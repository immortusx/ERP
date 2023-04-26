import React, { useState, useEffect } from 'react'
import '../styles/Registration.css'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setTokkenSlice } from '../redux/slices/authSlice'
import { getLoginUser, clearLoginState } from '../redux/slices/getLoginSlice'
import { getProfileData } from '../redux/slices/profileSlice'
import { setShowMessage } from '../redux/slices/notificationSlice'


export default function Login() {
    const dispatch = useDispatch()
    const loginState = useSelector(state => state.getLoginSlice.loginState)
    const tokkenState = useSelector(state => state.setTokkenSlice.tokkenState)
    const profileDataState = useSelector(state => state.profileData.profile)


    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    })
    function onChangeHandler(e) {
        if (e.target.name === 'email') {
            setLoginData(registerData => ({ ...loginData, 'email': e.target.value }))
        } else if (e.target.name === 'password') {
            setLoginData(registerData => ({ ...loginData, 'password': e.target.value }))
        }
    }
    // useEffect(() => {
    //     if (tokkenState) {
    //         navigate('/home')
    //     }
    // }, [tokkenState])


    useEffect(() => {
        if (profileDataState.isSuccess && profileDataState.profileData.isSuccess) {
            const rolesArray = [];
            Array.from(profileDataState.profileData.result.features).filter(i => {
                rolesArray.push(i.feature)
            })
            localStorage.setItem('rolesArray', rolesArray)
            if (tokkenState) {
                navigate('/home')
            }
        }
    }, [profileDataState])


    useEffect(() => {
        console.log('loginState.result', loginState.result);
        if (loginState.isSuccess === true) {
            if (loginState.result.message == 'success') {
                // taking first dealer for login 
                
                localStorage.setItem('byDealer', JSON.stringify(loginState.result.result.dealerResult[0]))
                localStorage.setItem('rbacToken', loginState.result.result.tokenIs)
                dispatch(setTokkenSlice(true))
                // navigate('/home')
                const token = localStorage.getItem('rbacToken')
                if (!token) {
                    return
                } else {
                    dispatch(getProfileData(token))
                    dispatch(setShowMessage('Welcome to Vehicle Management System'))
                }
            } else if (loginState.result.message != 'success') {
                dispatch(setShowMessage('Credentials are wrong'))
            } else {
                dispatch(setShowMessage('Something is wrong'))
            }
            dispatch(clearLoginState())
        } else if (loginState.isError === true) {
            dispatch(setShowMessage('Something is wrong'))
        }
    }, [loginState])

    function handleSubmit() {
        if (loginData.email.length > 0 && loginData.password.length > 0) {
            dispatch(getLoginUser(loginData))
        } else {
            dispatch(setShowMessage('Please fill all the field'))
        }
    }

    return (
        <main className='container'>
            {/* section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4 */}
            <div className='min-vh-100 d-flex flex-column align-items-center justify-content-center'>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <section className='px-3 col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center'>

                            <h5 className='text-center p-0 m-0'>
                                <strong>Vehicle Management System</strong>
                            </h5>
                            <div className='mainDivRegister mt-3 bg-white p-4'>
                                <h5 className='text-center'>Login</h5>
                                <section>
                                    <label htmlFor="email">Email </label>
                                    <input className='myInput' onChange={(e) => { onChangeHandler(e) }} type="text" id='email' name="email" />
                                </section>
                                <section>
                                    <label htmlFor="password">Password </label>
                                    <input className='myInput' onChange={(e) => { onChangeHandler(e) }} type="password" id='password' name="password" />
                                </section>
                                {/* <section>
                            <label htmlFor="confirmPassword">Confirm Password </label>
                            <input className='myInput' onChange={(e) => { onChangeHandler(e) }} type="password" id='confirmPassword' name="confirmPassword" />
                        </section> */}
                                <section>
                                    <button className='myBtn py-1' onClick={handleSubmit} type='button'>Log in</button>
                                </section>
                            </div>
                        </section>
                    </div>
                </div>

            </div>

        </main>
    )
}
