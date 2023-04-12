import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import '../styles/HomeScreen.css'
import { useSelector, useDispatch } from 'react-redux'
import { setTokkenSlice, clearAuthSliceState } from '../redux/slices/authSlice'
import { clearProfileData } from '../redux/slices/profileSlice'

import Header from './Header'
import Users from './Users'
import AddUser from './AddUser'
import AddRole from './AddRole'
import NoAuth from './NoAuth'
import Profile from './Profile'
import Inquiry from './Inquiry'
import Products from './Products'
import logo from '../assets/svg/logo.svg'
import logoT from '../assets/svg/logofinal.svg'
import { clearUserListState } from '../redux/slices/getUserListSlice'
import { setShowMessage } from '../redux/slices/notificationSlice'

import { useLocation, NavLink, Link, useNavigate, Navigate, BrowserRouter, Route, Routes } from "react-router-dom";
import InquiryCategories from './InquiryCategories'

const CheckPermission = ({ children, path }) => {
  // console.log('path', path)
  // console.log('checkList.includes(path)', checkList.includes(path));
  // return checkList.includes(path) ? children : <Navigate to="../no-access" />
  // return checkList.includes(path) ? children : <h3>No access</h3>
  const rolesArray = localStorage.getItem('rolesArray')
  const checkList = rolesArray.split(',')
  return checkList.includes(path) ? children : <NoAuth></NoAuth>
}

export default function HomeScreen() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [userPermissions, setUserPermissions] = useState([])
  const adminAsideRef = useRef()
  const toggleBtnRef = useRef()
  const navigate = useNavigate();
  const profileDataState = useSelector(state => state.profileData.profile)

  useEffect(() => {
    const collapse = document.getElementsByClassName('activeLink')
    if (collapse.length > 0) {

      collapse[0].parentElement.parentElement.parentElement.classList.add('show')
    }
  }, [])
  useEffect(() => {
    document.getElementsByTagName('body')[0].style.backgroundColor = '#edf1f4'
  }, [])
  const checkTabGrant = useCallback((pathAr) => {
    let success = false;
    const rolesArray = localStorage.getItem('rolesArray')
    const checkList = rolesArray.split(',')
    pathAr.forEach(element => {
      if (checkList.includes(element)) {
        success = true;
      }
    });
    return success
  }, [])
  function logOutHandler() {
    localStorage.removeItem('rbacToken')
    localStorage.removeItem('rolesArray')
    dispatch(setTokkenSlice(false))
    dispatch(clearUserListState())
    dispatch(clearAuthSliceState())
    dispatch(clearProfileData())
    navigate('/login')
  }
  function cancelBtn() {
    document.getElementById('asideProfilTab').click()
  }
  function getDateTime(time) {
    const data = new Date(time)
    const newDate = data.toDateString('DD-MM-YYYY');
    const newTime = data.toLocaleTimeString();
    return `${newDate} ${newTime}`
  }

  function toggleHandler() {
    if (document.getElementById('root').classList.contains('toggleSideBar')) {
      document.getElementById('root').classList.remove('toggleSideBar')
    } else {
      document.getElementById('root').classList.add('toggleSideBar')
    }
  }
  return (
    <>
      <aside ref={adminAsideRef} className='asideNav'>
        <button onClick={toggleHandler} ref={toggleBtnRef} className='toggleBtn'>
          <main className=''>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="headSvg bi bi-chevron-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
            </svg>
          </main>
        </button>
        <main className='asideMain'>
          <section className='outerSection'>
            <div className='logoDiv'>
              <img className='logoB' src={logo} alt="Logo" />
              <img className='logoT d-none' src={logoT} alt="Logo" />
            </div>
            <ul id="accordionExample" className="outUl">
              {
                checkTabGrant(['profile']) && <li className='outLi'>
                  <button className="headBtn" type="button" data-bs-toggle="collapse" data-bs-target="#home-collapseOne" aria-expanded="false" aria-controls="home-collapseOne">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="headSvg bi bi-house" viewBox="0 0 16 16">
                      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                    </svg>
                    <span>
                      Home
                    </span>
                  </button>
                  <div id="home-collapseOne" data-bs-parent="#accordionExample" className="accordion-collapse collapse" >
                    <ul className='inUl'>
                      {
                        checkTabGrant(['profile']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="profile" >
                            Profile
                          </NavLink>
                        </li>
                      }
                      {
                        checkTabGrant(['profile']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="inquiry" >
                            Inquiry
                          </NavLink>
                        </li>
                      }
                    </ul>
                  </div>
                </li>
              }
              {
                checkTabGrant(['products']) && <li className='outLi'>
                  <button className="headBtn" type="button" data-bs-toggle="collapse" data-bs-target="#service-collapseOne" aria-expanded="false" aria-controls="service-collapseOne">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="headSvg bi bi-house" viewBox="0 0 16 16">
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                  </svg> */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-grid" viewBox="0 0 16 16">
                      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                    </svg>
                    <span>
                      Service
                    </span>
                  </button>
                  <div id="service-collapseOne" data-bs-parent="#accordionExample" className="accordion-collapse collapse">
                    <ul className='inUl'>
                      {

                        checkTabGrant(['products']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="products" >
                            Products
                          </NavLink>
                        </li>
                      }
                    </ul>
                  </div>
                </li>
              }
              {
                checkTabGrant(['roles', 'add-role', 'add-user', 'users']) && <li className='outLi'>
                  <button className="headBtn" type="button" data-bs-toggle="collapse" data-bs-target="#admin-collapseOne" aria-expanded="false" aria-controls="admin-collapseOne">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="headSvg bi bi-house" viewBox="0 0 16 16">
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                  </svg> */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-person-gear" viewBox="0 0 16 16">
                      <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                    </svg>
                    <span>
                      Administration
                    </span>
                  </button>
                  <div id="admin-collapseOne" data-bs-parent="#accordionExample" className="accordion-collapse collapse" >
                    <ul className='inUl'>
                      {

                        checkTabGrant(['roles']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="roles" >
                          Roles
                          </NavLink>
                        </li>
                      }
                      {
                        checkTabGrant(['users']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="users" >
                            Users
                          </NavLink>
                        </li>
                      }
                      {
                        checkTabGrant(['users']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="inquiry-categories" >
                          Inquiry categories
                          </NavLink>
                        </li>
                      }
                    </ul>
                  </div>
                </li>
              }

            </ul>
          </section>
          <div className='mb-3'>
            <section className='profileSection outerSection'>
              <div id='asideProfilTab' type="button" data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#logOutDiv" className='d-flex flex-row'>
                <div className='myTextContainer'>
                  <span className='text-uppercase'>{profileDataState.isSuccess ? `${profileDataState?.profileData.result.first_name.slice(0, 1)}` : 'A'}</span>
                </div>
                <div className='userNameDis ps-2 d-flex align-items-center '>
                  <h6 className='m-0 text-uppercase text-white'>{profileDataState.isSuccess ? `${profileDataState?.profileData.result.first_name} ${profileDataState?.profileData.result.last_name}` : 'User'}</h6>
                </div>
              </div>
              <div id='logOutDiv' className='collapse' >
                <div className='logoutSideBar '>
                  <div className='d-flex justify-content-between'>
                    <h5 className='text-white'>{profileDataState.isSuccess ? `${profileDataState?.profileData.result.email}` : 'abc@gmail.com'}</h5>
                    <button onClick={cancelBtn} className='svgBtn'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                      </svg>
                    </button>
                  </div>
                  <div className='mt-3 d-flex flex-column'>
                    <div className='d-flex flex-wrap align-items-center border-bottom pb-2'>
                      <div className='myTextContainer'>
                        <span className='text-uppercase'>{profileDataState.isSuccess ? `${profileDataState?.profileData.result.first_name.slice(0, 1)}` : 'A'}</span>
                      </div>
                      <span className='pt-2 ps-2 text-white myH7'>Last login : {profileDataState.isSuccess && profileDataState?.profileData.result.last_login != null ? getDateTime(profileDataState?.profileData.result.last_login) : 'never'}</span>
                    </div>
                    <div className='mt-3 d-flex justify-content-end'>
                      <button className='myBtn py-1 px-3' onClick={logOutHandler} href="">
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </aside>




      <main id='mainContainer' className=''>
        <div className='container p-4'>
          <Routes>
            <Route path="no-access" element={<NoAuth />} exact />

            <Route path="users" element={<CheckPermission path='users'><Users /></CheckPermission>} exact />
            <Route path="profile" element={<CheckPermission path='profile'><Profile /></CheckPermission>} exact />
            <Route path="inquiry" element={<CheckPermission path='profile'><Inquiry /></CheckPermission>} exact />
            <Route path="new-inquiry" element={<CheckPermission path='profile'><Inquiry workFor='newInquiry' /></CheckPermission>} exact />
            <Route path="add-role" element={<CheckPermission path='add-role'><AddRole workFor='addRole' /></CheckPermission>} exact />
            <Route path="roles" element={<CheckPermission path='roles'><AddRole workFor='roles' /></CheckPermission>} exact />
            <Route path="add-user" element={<CheckPermission path='add-user'><AddUser workFor='forAdd' /></CheckPermission>} exact />
            <Route path="edit-user" element={<CheckPermission path='edit-user'><AddUser workFor='forEdit' /></CheckPermission>} exact />
            <Route path="inquiry-categories" element={<CheckPermission path='users'><InquiryCategories /></CheckPermission>} exact />
            {/* <Route path='admin'>
          </Route> */}
            <Route path="products" element={<CheckPermission path='products'><Products /></CheckPermission>} exact />

            <Route path="*" element={<Navigate to="profile" />} />

          </Routes>

        </div>
      </main>

    </>

  )
}
