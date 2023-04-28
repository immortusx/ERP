import logo from './logo.svg';
import HomeScreen from './components/HomeScreen'
import Registration from './components/Registration'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Login from './components/Login';
import NotificationBox from './components/NotificationBox';
import { isAdminExist } from './redux/slices/adminSlice'
import { getProfileData } from './redux/slices/profileSlice'
import { setShowMessage } from './redux/slices/notificationSlice'


// hello ji
const PublicRoute = (({ children }) => {
  const rbacToken = localStorage.getItem('rbacToken')
  return rbacToken && rbacToken.length > 0 ? children : <Navigate to="/" />;
})

function App() {
  const dispatch = useDispatch()
  const adminExist = useSelector(state => state.AdminSlice.adminExist)
  const profileDataState = useSelector(state => state.profileData.profile)
  const notificationState = useSelector(state => state.notificationState.message)
  const tokenDealerState = useSelector(state => state.tokenDealerChangeState.tokenDealerState)
  const allState = useSelector(state => state)

  useEffect(() => {
    if (tokenDealerState.isSuccess) {
      if (tokenDealerState.data.isSuccess) {
        console.log('tokenDealerState', tokenDealerState)
        // localStorage.setItem

        // localStorage.removeItem('rbacToken')
        // localStorage.setItem('rbacToken', tokenDealerState.data.result)
        // dispatch(getProfileData(tokenDealerState.data.result))

        // dispatch(setShowMessage('Welcome to Vehicle Management System'))


      }
    }
  }, [tokenDealerState])
  useEffect(() => {
    if (notificationState.length > 0) {
      setTimeout(() => {
        dispatch(setShowMessage(''))
      }, 3000)
    }
  }, [notificationState])


  useEffect(() => {
    console.log('app called allState', allState)
    dispatch(isAdminExist())
    const token = localStorage.getItem('rbacToken')
    if (!token) {
      return
    } else {
      console.log('first call ************')
      dispatch(getProfileData(token))
    }
  }, [])

  useEffect(() => {
    if (profileDataState.isSuccess && profileDataState.currentUserData.isSuccess && tokenDealerState.isSuccess) {
      console.log('must call $$$$$$$$$$$$$$$$$ app.js', profileDataState)

      // const rolesArray = [];
      // Array.from(profileDataState.currentUserData.result.features).filter(i => {
      //     rolesArray.push(i.feature)
      // })
      // console.log('profileDataState.currentUserData', profileDataState.currentUserData)

      // localStorage.setItem('rolesArray', rolesArray)

      // let rbacToken = localStorage.getItem('rbacToken')
      // if (rbacToken) {
      //     navigate('/home')
      // }
      // dispatch(clearProfileDataSliceState())

    }
  }, [profileDataState, tokenDealerState])
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
