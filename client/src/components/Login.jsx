import React, { useState, useEffect } from 'react'
import '../styles/Registration.css'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getLoginUser, clearLoginState } from '../redux/slices/getLoginSlice'
import { getProfileData, clearProfileDataSliceState } from '../redux/slices/profileSlice'
import { setShowMessage } from '../redux/slices/notificationSlice'
//import lg from "../assets/svg/logo.svg";
import lg from "../assets/images/lg.png"
// import lg from "../assets/images/loginlogo.png"
import eyeIcon from "../assets/images/view.png";
import eyeIconClose from "../assets/images/hide.png"
import LanguageSelector from './languageSelector'
import enTranslations from "../assets/locals/en.json"
import gjTranslations from "../assets/locals/gj.json"

export default function Login() {
    const dispatch = useDispatch()
    const loginState = useSelector(state => state.getLoginSlice.loginState)
    const profileDataState = useSelector(state => state.profileData.profile)
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [language, setLanguage] = useState('en'); // Default language is English

    const translations = language === 'en' ? enTranslations : gjTranslations;


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
    useEffect(() => {
        if (profileDataState.isSuccess && profileDataState.currentUserData.isSuccess) {
            const rolesArray = [];
            Array.from(profileDataState.currentUserData.result.features).filter(i => {
                rolesArray.push(i.feature)
            })
            localStorage.setItem('rolesArray', rolesArray)
            localStorage.setItem('userData', JSON.stringify(profileDataState.currentUserData.result))

            dispatch(clearProfileDataSliceState())
            navigate('/home')
        }
    }, [profileDataState])


    useEffect(() => {
        if (loginState.isSuccess === true) {
            console.log(loginState.result, 'loginresult>>>>>>');
            if (loginState.result.message == 'success') {
                // taking first dealer for login 

                localStorage.setItem('dealersList', JSON.stringify(loginState.result.result.branchResult))
                localStorage.setItem('rbacToken', loginState.result.result.tokenIs)
                localStorage.setItem('currentDealerId', loginState.result.result.currentBranch)
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
            dispatch(getLoginUser(loginData));
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', loginData.email);
            }
        } else {
            dispatch(setShowMessage('Please fill all the field'));
        }
    }
    useEffect(() => {
        // Check if there is a remembered username
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            setLoginData({ ...loginData, email: rememberedUsername });
            setRememberMe(true); // Check the Remember Me checkbox
        }
    }, []);

    return (
        <main>
            <div className='d-flex align-items-start justify-content-end'>
                <LanguageSelector onChangeLanguage={(selectedLanguage) => setLanguage(selectedLanguage)} />
            </div>

            <div className='container'>
                {/* section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4 */}
                <div className=' d-flex flex-column align-items-center justify-content-center'>
                    <div className='container'>
                        <div className=' row justify-content-center'>
                            <section className='col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center'>

                                {/* <h5 className='text-center p-0 m-0'>
                                <strong>Vehicle Management System</strong>
                            </h5> */}
                                <div style={{ marginTop: '45px' }}>
                                    <img src={lg} alt="Logo" height={200} width={350} />
                                </div>
                                <div className='mainDivRegister mt-3 bg-white p-4'>
                                    <h2 className='text-left'>{translations.login}</h2>
                                    <section>
                                        <label htmlFor="email" style={{ fontSize: '17px', marginLeft: '5px' }}>{translations.username} </label>
                                        <input className='myInputl' onChange={(e) => { onChangeHandler(e) }} type="text" id='email' name="email" />
                                    </section>
                                    <section>

                                        <label htmlFor="password" style={{ fontSize: '17px', marginLeft: '5px' }}>{translations.password} </label>
                                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                            <input
                                                className='myInputl'
                                                onChange={(e) => { onChangeHandler(e) }}
                                                type={showPassword ? 'text' : 'password'}
                                                id='password'
                                                name="password"
                                                style={{ flex: '1' }}
                                            />
                                            <img
                                                src={showPassword ? eyeIconClose : eyeIcon}
                                                alt="Toggle Password"
                                                height={20}
                                                width={20}
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ cursor: 'pointer', position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)' }}
                                            />
                                        </div>

                                    </section>

                                    <section className="remember-me" style={{ fontSize: '14px', display: 'inline-block' }}>
                                        <label htmlFor="rememberMe" className="checkbox-label" style={{ verticalAlign: 'middle' }}>
                                            <input
                                                style={{ marginRight: '7px', marginLeft: '15px', width: '18px', height: '18px', verticalAlign: 'middle' }}
                                                type="checkbox"
                                                id="rememberMe"
                                                name="rememberMe"
                                                checked={rememberMe}
                                                onChange={() => setRememberMe(!rememberMe)}
                                            />
                                            {translations.rememberMe}
                                        </label>
                                    </section>

                                    {/* <section>
                            <label htmlFor="confirmPassword">Confirm Password </label>
                            <input className='myInput' onChange={(e) => { onChangeHandler(e) }} type="password" id='confirmPassword' name="confirmPassword" />
                        </section> */}
                                    <section>
                                        <button className='myBtnl py-1' style={{ fontSize: '18px' }} onClick={handleSubmit} type='button'>  {translations.loginButton}</button>
                                    </section>
                                    <section>
                                        <button className='myBtnl py-1' style={{ fontSize: '18px' }} type='button'>  {translations.forgotPassword}</button>
                                    </section>
                                </div>
                            </section>
                        </div>
                    </div>

                </div >

            </div >
        </main>
    )
}
