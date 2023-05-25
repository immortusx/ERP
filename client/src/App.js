import logo from './logo.svg';
import HomeScreen from './components/HomeScreen'
import Registration from './components/Registration'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Login from './components/Login';
import NotificationBox from './components/NotificationBox';
import { isAdminExist } from './redux/slices/adminSlice'
import { getProfileData } from './redux/slices/profileSlice'
import { setShowMessage } from './redux/slices/notificationSlice'
import BreadCrumb from './components/BreadCrumb/BreadCrumb';



const PublicRoute = (({ children }) => {

  const rbacToken = localStorage.getItem('rbacToken')
  return rbacToken && rbacToken.length > 0 ? children : <Navigate to="/" />;
})

function App() {
  const dispatch = useDispatch()
  const adminExist = useSelector(state => state.AdminSlice.adminExist)
  const notificationState = useSelector(state => state.notificationState.message)
  const allState = useSelector(state => state)
  useEffect(() => {
    if (notificationState.length > 0) {
      setTimeout(() => {
        dispatch(setShowMessage(''))
      }, 3000)
    }
  }, [notificationState])

  useEffect(() => {
    dispatch(isAdminExist())
    const token = localStorage.getItem('rbacToken')
    if (!token) {
      return
    } else {
      dispatch(getProfileData(token))
    }
  }, [])


  const checkAdminExist = useMemo(() => {

    console.log('adminExist', adminExist)
    if (adminExist?.result.result) {
      return true
    } else {
      return false
    }

  }, [adminExist])
  // function checkAdminExist() {
  //   console.log('adminExist', adminExist)
  //   if (adminExist?.result.result) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }


  useEffect(() => {
    const onStorageChange = () => {
      // setValue(localStorage.getItem('myValue') || '');
      console.log('localstorage changed')
      // window.location.reload();
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
              <Route path="/home/*" element={<PublicRoute > <HomeScreen /></PublicRoute>} />
              <Route path="/*" element={<Navigate to='/login' />} exact />
              {/* <Route path="/" element={<Navigate to='/login' />} exact /> */}
            </> : <>
              <Route path="/registration" element={<Registration />} exact />
              <Route path="/*" element={<Navigate to='/registration' />} exact />
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
