import logo from './logo.svg';
import HomeScreen from './components/HomeScreen'
import Registration from './components/Registration'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Login from './components/Login';
import NotificationBox from './components/NotificationBox';
import { adminIsSet, setTokkenSlice } from './redux/slices/authSlice.js'
import { isAdminExist } from './redux/slices/adminSlice'
import { getProfileData } from './redux/slices/profileSlice'
import { setShowMessage } from './redux/slices/notificationSlice'


// hello ji
const PublicRoute = (({ children, tokkenState }) => {
  const rbacToken = localStorage.getItem('rbacToken')
  return rbacToken && rbacToken.length > 0 ? children : <Navigate to="/" />;
})

function App() {
  const dispatch = useDispatch()
  const tokkenState = useSelector(state => state.setTokkenSlice.tokkenState)
  const adminState = useSelector(state => state.setTokkenSlice.adminState)
  const adminExist = useSelector(state => state.AdminSlice.adminExist)
  const profileDataState = useSelector(state => state.profileData.profile)
  const notificationState = useSelector(state => state.notificationState.message)

  useEffect(() => {
    if (notificationState.length > 0) {
      setTimeout(() => {
        dispatch(setShowMessage(''))
      }, 3000)
    }
  }, [notificationState])


  useEffect(() => {
    if(profileDataState.isSuccess)
    {
      console.log('profileDataState', profileDataState)
    }

  }, [profileDataState])
  useEffect(() => {
    dispatch(isAdminExist())
    const token = localStorage.getItem('rbacToken')
    if (!token) {
      return
    } else {
      dispatch(getProfileData(token))
    }
    if (token && token.length > 0) {
      dispatch(setTokkenSlice(true))
    } else {
      dispatch(setTokkenSlice(false))
    }
  }, [])
  function checkAdminExist() {
    if (adminExist?.result.result) {
      return true
    } else {
      return false
    }
  }


  useEffect(() => {
    const onStorageChange = () => {
      // setValue(localStorage.getItem('myValue') || '');
      console.log('localstorage changed')
    };

    window.addEventListener('storage', onStorageChange);

    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {
            // adminExist?.result.result == true ?
            checkAdminExist ? <>
              <Route path="/login" element={<Login />} exact />
              <Route path="/home/*" element={<PublicRoute tokkenState={tokkenState}> <HomeScreen /></PublicRoute>} />
              <Route path="/*" element={<Navigate to='/login' />} exact />
              {/* <Route path="/" element={<Navigate to='/login' />} exact /> */}
            </> : <>
              <Route path="/registration" element={<Registration />} exact />
              <Route path="/" element={<Navigate to='/registration' />} exact />
            </>
          }
        </Routes>
        {
          notificationState && notificationState.length > 0 && <NotificationBox notificationState={notificationState} />
          // 1==1 && <NotificationBox notificationState={notificationState} />
        }
      </BrowserRouter >
    </>
  );
}

export default App;
