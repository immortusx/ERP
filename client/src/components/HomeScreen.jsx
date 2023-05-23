import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'

import '../styles/HomeScreen.css'

import Header from './Header'
import Users from './Users'
import AddUser from './AddUser'
import AddRole from './AddRole'
import NoAuth from './NoAuth'
import EnquiryList from './EnquiryList'
import Sales from './Sales'
import Manage from './Manage'
import Profile from './Profile'
import Enquiry from './Enquiry'
import Products from './Products'
import Master from './Master'

import logo from '../assets/svg/logo.svg'
import logoT from '../assets/svg/logofinal.svg'

import { useSelector, useDispatch } from 'react-redux'
import { getProfileData, clearCurrentUserData, clearProfileDataSliceState } from '../redux/slices/profileSlice'

import { clearUserListState } from '../redux/slices/getUserListSlice'
import { setShowMessage } from '../redux/slices/notificationSlice'
import { tokenDealerChangeDb, clearTokenDealerState } from '../redux/slices/tokenDealerChangeSlice'

import { useLocation, NavLink, Link, useNavigate, Navigate, BrowserRouter, Route, Routes, json } from "react-router-dom";
import EnquiryCategories from './EnquiryCategories'
import Branch from './Branch'
import State_list from './Master/State/State_list'
import District_list from './Master/District/District_list'
<<<<<<< HEAD
import Village_list from './Master/Village/Village_list'
=======
import Taluka_list from './Master/Taluka/Taluka_list'
>>>>>>> master

const CheckPermission = ({ children, path }) => {
  // return checkList.includes(path) ? children : <Navigate to="../no-access" />
  // return checkList.includes(path) ? children : <h3>No access</h3>
  const rolesArray = localStorage.getItem('rolesArray')
  const checkList = rolesArray.split(',')
  // console.log('path', path)
  // console.log('checkList.includes(path)', checkList.includes(path));
  return checkList.includes(path) ? children : <NoAuth></NoAuth>
}

export default function HomeScreen() {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate();

  const bottomDiv = useRef()
  const adminAsideRef = useRef()
  const toggleBtnRef = useRef()

  const [bottomDivState, setBottomDivState] = useState(false)
  const [userPermissions, setUserPermissions] = useState([])
  const [currentDealer, setCurrentDealer] = useState([])

  const profileDataState = useSelector(state => state.profileData.profile)
  const allState = useSelector(state => state)
  const tokenDealerState = useSelector(state => state.tokenDealerChangeState.tokenDealerState)



  useEffect(() => {
    if (tokenDealerState.isSuccess) {
      if (tokenDealerState.data.isSuccess) {
        localStorage.setItem('rbacToken', tokenDealerState.data.result)

        // dispatch(getProfileData(tokenDealerState.data.result))
        dispatch(clearTokenDealerState())
        console.log('please redirect to home')
        navigate('/home')

        window.location.reload()

      }
    }

  }, [tokenDealerState])


  useEffect(() => {
    const collapse = document.getElementsByClassName('activeLink')
    if (collapse.length > 0) {

      collapse[0].parentElement.parentElement.parentElement.classList.add('show')
    }
  }, [])


  useEffect(() => {
    console.log('profileDataState', profileDataState)
    if (profileDataState.isSuccess && profileDataState.currentUserData.isSuccess) {
      const rolesArray = [];
      Array.from(profileDataState.currentUserData.result.features).filter(i => {
        rolesArray.push(i.feature)
      })
      localStorage.setItem('rolesArray', rolesArray)
      localStorage.setItem('userData', JSON.stringify(profileDataState.currentUserData.result))
      dispatch(clearProfileDataSliceState())
      // navigate('/home')
    } else if (profileDataState.isError) {
      dispatch(setShowMessage('Server is temporarily unavailable'))
    }
  }, [profileDataState])

  useEffect(() => {
    if (bottomDivState) {
      let handler = (event) => {
        if (!bottomDiv.current.contains(event.target)) {
          setBottomDivState(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => {

        document.removeEventListener('mousedown', handler)
      }
    }
  }, [bottomDivState])

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
    localStorage.clear()
    dispatch(clearUserListState())
    dispatch(clearProfileDataSliceState())
    dispatch(clearCurrentUserData())
    dispatch(clearCurrentUserData())
    dispatch(clearProfileDataSliceState())

    navigate('/login')
  }
  function getDateTime(time) {
    const data = new Date(time)
    const newDate = data.toDateString('DD-MM-YYYY');
    const newTime = data.toLocaleTimeString();
    return `${newDate} ${newTime}`
  }

  function dealerListChange(e) {
    let selectedDealerId = e.target.value
    localStorage.setItem('currentDealerId', selectedDealerId)
    dispatch(tokenDealerChangeDb(selectedDealerId))

  }
  function toggleHandler() {
    if (document.getElementById('root').classList.contains('toggleSideBar')) {
      document.getElementById('root').classList.remove('toggleSideBar')
    } else {
      document.getElementById('root').classList.add('toggleSideBar')
    }
  }
  useEffect(() => {
    let jsonData = localStorage.getItem('dealersList')
    let dealersList = JSON.parse(jsonData)
    // set here dealersList
    setCurrentDealer(dealersList)
  }, [])
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
                      {/* {
                        checkTabGrant(['profile']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="enquiry" >
                            Enquiry
                          </NavLink>
                        </li>
                      } */}

                    </ul>
                  </div>
                </li>
              }
              {
                checkTabGrant(['profile']) && <li className='outLi'>
                  <button className="headBtn" type="button" data-bs-toggle="collapse" data-bs-target="#sale-collapse" aria-expanded="false" aria-controls="sale-collapse">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-graph-up-arrow" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z" />
                    </svg>
                    <span>
                      Sale
                    </span>
                  </button>
                  <div id="sale-collapse" data-bs-parent="#accordionExample" className="accordion-collapse collapse" >
                    <ul className='inUl'>
                      {
                        checkTabGrant(['profile']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="enquiryies" >
                            Enquiry
                          </NavLink>
                        </li>
                      }
                    </ul>
                  </div>
                </li>
              }
              {
                checkTabGrant(['products', 'sales']) && <li className='outLi'>
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
                      {
                        checkTabGrant(['sales']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="sales" >
                            Sales
                          </NavLink>
                        </li>
                      }
                    </ul>
                  </div>
                </li>
              }
              {
                checkTabGrant(['manage']) && <li className='outLi'>
                  <button className="headBtn" type="button" data-bs-toggle="collapse" data-bs-target="#manage-collapseOne" aria-expanded="false" aria-controls="manage-collapseOne">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-diagram-3-fill" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1z" />
                    </svg>
                    <span>
                      Management
                    </span>
                  </button>
                  <div id="manage-collapseOne" data-bs-parent="#accordionExample" className="accordion-collapse collapse">
                    <ul className='inUl'>
                      {

                        checkTabGrant(['manage']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="manage" >
                            Manage
                          </NavLink>
                        </li>
                      }
                    </ul>
                  </div>
                </li>
              }
              {
                checkTabGrant(['roles', 'add-role', 'add-user', 'users', 'branch']) && <li className='outLi'>
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
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="enquiry-categories" >
                            Enquiry categories
                          </NavLink>
                        </li>
                      }
                      {
                        checkTabGrant(['branch']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="branch" >
                            Branch
                          </NavLink>
                        </li>
                      }
                    </ul>
                  </div>
                </li>
              }
              {
                checkTabGrant(['profile']) && <li className='outLi'>
                  <button className="headBtn" type="button" data-bs-toggle="collapse" data-bs-target="#master-collapse" aria-expanded="false" aria-controls="master-collapse">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                    </svg>
                    <span>
                      Master
                    </span>
                  </button>
                  <div id="master-collapse" data-bs-parent="#accordionExample" className="accordion-collapse collapse" >
                    <ul className='inUl'>
                      {

                        checkTabGrant(['profile']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="master" >
                            Master
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
              <div onClick={() => { bottomDivState ? setBottomDivState(false) : setBottomDivState(true) }} id='asideProfilTab' type="button" className='d-flex flex-row'>
                <div className='myTextContainer'>
                  <span className='text-uppercase'>{Object.keys(profileDataState.currentUserData).length ? `${profileDataState?.currentUserData?.result?.first_name.slice(0, 1)}` : 'A'}</span>
                </div>
                <div className='userNameDis ps-2 d-flex align-items-center '>
                  <h6 className='m-0 text-uppercase text-white'>{Object.keys(profileDataState.currentUserData).length ? `${profileDataState?.currentUserData.result.first_name} ${profileDataState?.currentUserData.result.last_name}` : 'User'}</h6>
                </div>
              </div>
              {
                bottomDivState && <div ref={bottomDiv} className='logoutSideBar'>
                  <div className='d-flex justify-content-between'>
                    <h6 className='text-white'>Email : {Object.keys(profileDataState.currentUserData).length > 0 && `${profileDataState?.currentUserData.result.email}`}</h6>
                    <button onClick={() => { setBottomDivState(false) }} className='svgBtn'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                      </svg>
                    </button>
                  </div>
                  <h6 className='text-white mt-2'>Current branch :
                    <select defaultValue={localStorage.getItem('currentDealerId')} onChange={dealerListChange} className='mt-2 mySelectBox' name="" id="">
                      {currentDealer && currentDealer.length > 0 && currentDealer.map((dealer, index) => {
                        return <option key={index} value={dealer.id}>{dealer.name}</option>
                      })}
                    </select>
                  </h6>
                  <div className='mt-3 d-flex flex-column'>
                    <div className='d-flex flex-wrap align-items-center border-bottom pb-2'>
                      <div className='myTextContainer'>
                        <span className='text-uppercase'>{Object.keys(profileDataState.currentUserData).length > 0 ? `${profileDataState?.currentUserData?.result?.first_name.slice(0, 1)}` : 'A'}</span>
                      </div>
                      <span className='pt-2 ps-2 text-white myH7'>Last login : {Object.keys(profileDataState.currentUserData).length > 0 && profileDataState?.currentUserData.result.last_login != null ? getDateTime(profileDataState?.currentUserData.result.last_login) : 'first time logged in'}</span>
                    </div>
                    <div className='mt-3 d-flex justify-content-end'>
                      <button className='myBtn py-1 px-3' onClick={logOutHandler} href="">
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              }
            </section>
          </div>
        </main>
      </aside>




      <main id='mainContainer' className=''>
        <div className='container position-relative p-4'>
          <Routes>
            <Route path="no-access" element={<NoAuth />} exact />

            <Route path="users" element={<CheckPermission path='users'><Users /></CheckPermission>} exact />
            <Route path="profile" element={<CheckPermission path='profile'><Profile /></CheckPermission>} exact />
            <Route path="enquiry" element={<CheckPermission path='profile'><Enquiry /></CheckPermission>} exact />
            <Route path="new-enquiry" element={<CheckPermission path='profile'><Enquiry workFor='newEnquiry' /></CheckPermission>} exact />
            <Route path="enquiryies" element={<CheckPermission path='profile'><EnquiryList /></CheckPermission>} exact />

            <Route path="master" element={<CheckPermission path='profile'><Master /></CheckPermission>} exact />
            <Route path="state-list" element={<CheckPermission path='profile'><State_list /></CheckPermission>} exact />
            <Route path="district-list" element={<CheckPermission path='profile'><District_list /></CheckPermission>} exact />
            <Route path="village-list" element={<CheckPermission path='profile'><Village_list /></CheckPermission>} exact />
            <Route path="taluka-list" element={<CheckPermission path='profile'><Taluka_list /></CheckPermission>} exact />

            <Route path="sales" element={<CheckPermission path='sales'><Sales /></CheckPermission>} exact />

            <Route path="manage" element={<CheckPermission path='manage'><Manage /></CheckPermission>} exact />


            <Route path="add-role" element={<CheckPermission path='add-role'><AddRole workFor='addRole' /></CheckPermission>} exact />
            <Route path="roles" element={<CheckPermission path='roles'><AddRole workFor='roles' /></CheckPermission>} exact />
            <Route path="add-user" element={<CheckPermission path='add-user'><AddUser workFor='forAdd' /></CheckPermission>} exact />
            <Route path="edit-user" element={<CheckPermission path='edit-user'><AddUser workFor='forEdit' /></CheckPermission>} exact />

            <Route path="enquiry-categories" element={<CheckPermission path='users'><EnquiryCategories /></CheckPermission>} exact />

            <Route path="branch" element={<CheckPermission path='branch'><Branch workFor='branch' /></CheckPermission>} exact />
            <Route path="add-branch" element={<CheckPermission path='branch'><Branch workFor='addBranch' /></CheckPermission>} exact />

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
