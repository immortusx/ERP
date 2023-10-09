import React, { useState, useEffect } from 'react';
import '../styles/Registration.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getLoginUser, clearLoginState } from '../redux/slices/getLoginSlice';
import { getProfileData, clearProfileDataSliceState } from '../redux/slices/profileSlice';
import { setShowMessage } from '../redux/slices/notificationSlice';
import lg from "../assets/images/lg.png";
import eyeIcon from "../assets/images/view.png";
import eyeIconClose from "../assets/images/hide.png";
import LanguageSelector from './languageSelector';
import downloadIcon from "../assets/images/apps.png";
import translations from '../assets/locals/translations';

export default function Login() {
    const dispatch = useDispatch();
    const loginState = useSelector(state => state.getLoginSlice.loginState);
    const profileDataState = useSelector(state => state.profileData.profile);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [language, setLanguage] = useState('en');
    const currentLanguage = useSelector((state) => state.language.language);
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });


    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    const downloadAndroidApp = async () => {
        console.log("Downloading Android.....");
        const androidApkUrl = `${process.env.REACT_APP_NODE_URL}/api/download`;
        const anchor = document.createElement('a');
        anchor.style.display = 'none';
        anchor.href = androidApkUrl;
        anchor.download = 'android-app.apk';
        document.body.appendChild(anchor);

        anchor.click();

        document.body.removeChild(anchor);

        // Listen for the download to finish or fail
        anchor.addEventListener('load', () => {
            // Download successful
            console.log("Download successful");
        });

        anchor.addEventListener('error', () => {
            // Download failed, show an alert
            console.error("Download failed");
            window.alert("Application not found");
        });
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

      const downloadiOsApp = async () => {
        console.log("Downloading iOs.....")
        window.alert("App Not Found")
    }

    useEffect(() => {
        if (currentLanguage) {
            console.log(currentLanguage, translations, 'gdkgg');
            console.log(translations[currentLanguage].login);
        }
    }, [currentLanguage]);


    const handleSubmit = () => {
        if (loginData.username.length > 0 && loginData.password.length > 0) {
            dispatch(getLoginUser(loginData));
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', loginData.username);
            }
        } else {
            dispatch(setShowMessage('Please fill all the fields'));
        }
    };

    useEffect(() => {
        // Check if there is a remembered username
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            setLoginData({ ...loginData, username: rememberedUsername });
            setRememberMe(true); // Check the Remember Me checkbox
        }
    }, []);

    useEffect(() => {
        if (profileDataState.isSuccess && profileDataState.currentUserData.isSuccess) {
            const rolesArray = [];
            Array.from(profileDataState.currentUserData.result.features).filter(i => {
                rolesArray.push(i.feature);
            });
            localStorage.setItem('rolesArray', rolesArray);
            localStorage.setItem('userData', JSON.stringify(profileDataState.currentUserData.result));

            dispatch(clearProfileDataSliceState());
            navigate('/home');
        }
    }, [profileDataState, navigate]);

    useEffect(() => {
        if (loginState.isSuccess === true) {
            if (loginState.result.message === 'success') {
                localStorage.setItem('dealersList', JSON.stringify(loginState.result.result.branchResult));
                localStorage.setItem('rbacToken', loginState.result.result.tokenIs);
                localStorage.setItem('currentDealerId', loginState.result.result.currentBranch);
                const token = localStorage.getItem('rbacToken');
                if (!token) {
                    return;
                } else {
                    dispatch(getProfileData(token));
                    dispatch(setShowMessage('Welcome to Vehicle Management System'));
                }
            } else if (loginState.result.message !== 'success') {
                dispatch(setShowMessage('Credentials are wrong'));
            } else {
                dispatch(setShowMessage('Something is wrong'));
            }
            dispatch(clearLoginState());
        } else if (loginState.isError === true) {
            dispatch(setShowMessage('Something is wrong'));
        }
    }, [loginState, dispatch]);

    return (
        <main>
            <div className="col-md-13">
                <div className='d-flex align-items-start justify-content-end' style={{ marginRight: '20px' }}>
                    <div className="image-container">
                        <div className="download-container">
                            <div className="download-bar" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                {isHovered ? (
                                    <div className="download-menu-container">
                                        <button className="download-button" onClick={downloadiOsApp}>iOS</button>
                                        <button className="download-button" onClick={downloadAndroidApp}>Android</button>
                                    </div>
                                ) : (
                                    <img
                                        src={downloadIcon}
                                        alt="app"
                                        height={25}
                                        width={25}
                                        style={{ marginRight: '2px', marginTop: '1px' }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <LanguageSelector onChangeLanguage={(e) => setLanguage(e.target.value)} />
                </div>
            </div>

            <div className='container'>
                <div className=' d-flex flex-column align-items-center justify-content-center'>
                    <div className='container'>
                        <div className=' row justify-content-center'>
                            <section className='col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center'>
                                <div>
                                    <img src={lg} alt="Logo" height={200} width={350} />
                                </div>
                                <div className='mainDivRegister mt-3 bg-white p-4'>
                                    <h2 className='text-left'>{translations[currentLanguage].login}</h2>
                                    <section>
                                        <label htmlFor="username" style={{ fontSize: '17px', marginLeft: '5px' }}>{translations[currentLanguage].username} </label>
                                        <input
                                            className='myInputl'
                                            onChange={(e) => { setLoginData({ ...loginData, username: e.target.value }); }}
                                            onKeyDown={handleKeyDown}
                                            type="text"
                                            id='username'
                                            name="username"
                                            placeholder='Enter Email/Mobile Number'
                                        />
                                    </section>
                                    <section>
                                        <label htmlFor="password" style={{ fontSize: '17px', marginLeft: '5px' }}>{translations[currentLanguage].password} </label>
                                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                            <input
                                                className='myInputl'
                                                onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }); }}
                                                onKeyDown={handleKeyDown}
                                                type={showPassword ? 'text' : 'password'}
                                                id='password'
                                                name="password"
                                                placeholder='Enter Password'
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
                                            {translations[currentLanguage].rememberMe}
                                        </label>
                                    </section>
                                    <section>
                                        <button
                                            className='myBtnl py-1'
                                            style={{ fontSize: '18px' }}
                                            onClick={handleSubmit}
                                            type='submit'
                                        >
                                            {translations[currentLanguage].loginButton}
                                        </button>
                                    </section>
                                    <section>
                                        <button className='myBtnl py-1' style={{ fontSize: '18px' }} type='button'>{translations[currentLanguage].forgotPassword}</button>
                                    </section>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
