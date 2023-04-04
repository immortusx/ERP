import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addUserToDb, clearAddUserState } from '../redux/slices/addUserSlice'
import { clearEditUserState, clearEditUserData, editUserUpdateToDb } from '../redux/slices/editUserDataSlice'
import '../styles/AddUser.css'
import Axios from 'axios'
import { getToPathname } from '@remix-run/router'
import { setShowMessage } from '../redux/slices/notificationSlice'
import { useNavigate } from 'react-router-dom'


export default function AddUser({ workFor }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const addUserState = useSelector(state => state.addUserSlice.addUserState)
    const { editUserSliceState } = useSelector(state => state.editUserDataState)
    const editUserData = useSelector(state => state.editUserDataState.editUserData.data)

    const [roles, setRoles] = useState([])
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: [],
    })
    const selectInp = useRef()
    const selectedInp = useRef()
    const leftArrowBtn = useRef()
    const rightArrowBtn = useRef()
    useEffect(() => {
        if (editUserSliceState.isSuccess) {
            if (editUserSliceState.message.result === 'success') {
                dispatch(setShowMessage('User data is updated'))
                clearInpHook()
                dispatch(clearEditUserState())
                navigate('/home/users')

            } else {
                dispatch(setShowMessage('Something is wrong!'))
            }
        }
    }, [editUserSliceState])

    function handleSubmit() {
        const fN = userData.firstName;
        const lN = userData.lastName;
        const email = userData.email;
        const pass = userData.password;
        const pN = userData.phoneNumber;
        const role = userData.role;
        if (workFor != 'forAdd') {
            if (fN.length > 0 &&
                lN.length > 0 &&
                email.length > 0 &&
                pN.length > 0 &&
                role.length > 0) {
                userData['id'] = editUserData.id
                dispatch(editUserUpdateToDb(userData))
            } else {
                dispatch(setShowMessage('All field must be field'))
            }

        } else {
            if (fN.length > 0 &&
                lN.length > 0 &&
                email.length > 0 &&
                pass.length > 0 &&
                pN.length > 0 &&
                role.length > 0) {
                dispatch(addUserToDb(userData))
            } else {
                dispatch(setShowMessage('Please fill all the field'))
            }

        }
    }
    function getIdFromRoleName(name) {
        const doesExist = roles.find(nameExist => {
            if (nameExist.role == name) {

                return nameExist.id
            }
        })
    }
    useEffect(() => {
        if (workFor === 'forEdit') {
            if (editUserData === null) {
                dispatch(setShowMessage('Please select a user'))
                setTimeout(() => {
                    navigate('/home/users')
                }, 1000)
            } else {
                setUserData({
                    firstName: editUserData.first_name,
                    lastName: editUserData.last_name,
                    email: editUserData.email,
                    password: '',
                    phoneNumber: editUserData.phone_number,
                    role: []
                })

            }
        }
        return () => {
            if (workFor === 'forEdit') {
                dispatch(clearEditUserData())
            }
        }
    }, [workFor, editUserData])
    useEffect(() => {
        if (roles.length > 0 && workFor === 'forEdit' && editUserData) {
            let tempAr = [];
            editUserData.role.forEach((item) => {
                roles.find((findEach) => {
                    if (findEach.role === item) {
                        tempAr.push(findEach.id)
                    }
                })
            })
            setUserData({ ...userData, ['role']: tempAr })
        }
    }, [roles])


    function clearInpHook() {
        setUserData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNumber: '',
            role: [],
        })
        const allInp = document.getElementsByClassName('inputElement')
        Array.from(allInp).forEach((item) => {
            item.value = ''
        })
    }
    async function getRolesFromDb() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-roles`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await Axios.get(url, config).then((response) => {
            if (response.data?.isSuccess) {
                setRoles(response.data.result)
            }
        })
    }
    useEffect(() => {
        if (addUserState.isSuccess) {
            if (addUserState.message.result === 'success') {
                dispatch(setShowMessage('User is created'))
                clearInpHook()
                dispatch(clearAddUserState())
            } else if (addUserState.message.result === 'alreadyExist') {
                dispatch(setShowMessage('Please use a different email to continue!'))
                dispatch(clearAddUserState())
            } else {
                dispatch(setShowMessage('Something is wrong!'))
            }
        }
    }, [addUserState])
    useEffect(() => {
        getRolesFromDb()
    }, [])
    const getRoleName = useMemo(() => {
        const bb = [];
        Array.from(userData.role).forEach((g) => {
            const a = roles.find((i) => {
                return i.id == g
            })
            bb.push(a.role)
        })
        return bb
    }, [userData.role])

    function selectChangeCall(e) {
        if (e.target.selectedOptions.length > 0) {
            if (e.target.name === 'selectRole') {
                rightArrowBtn.current.classList.remove('disabledBtn')
            } else {
                leftArrowBtn.current.classList.remove('disabledBtn')
            }
        }
    }

    function rightClick() {
        let tempAr = []
        Array.from(userData.role).forEach(ids => {
            tempAr.push(ids)
        })
        Array.from(selectInp.current.selectedOptions).forEach(element => {
            const doesExist = userData.role.find(idExist => {
                return idExist == element.value
            })
            if (doesExist === undefined) {
                tempAr.push(parseInt(element.value))
            }
        });
        setUserData(userData => ({ ...userData, role: tempAr }))
        selectInp.current.value = 0
        rightArrowBtn.current.classList.add('disabledBtn')
    }

    function leftClick() {
        let tempAr = []
        Array.from(userData.role).forEach(ids => {
            tempAr.push(ids)
        })
        Array.from(selectedInp.current.selectedOptions).forEach(element => {
            const doesExist = roles.find(nameExist => {
                return nameExist.role == element.value
            })
            const index = tempAr.filter((i) => {
                return i != doesExist.id
            })
            tempAr = index
        })
        setUserData(userData => ({ ...userData, role: tempAr }))

        selectedInp.current.value = 0
        leftArrowBtn.current.classList.add('disabledBtn')
    }

    function handleCancel() {
        navigate('/home/users')

    }
    function onChangeHandler(e) {
        const name = e.target.name;
        const value = e.target.value;
        setUserData({ ...userData, [name]: value })
    }

    return (
        <div className='addUser bg-white rounded p-3'>
            <main>
                <h5 className='m-0'>
                    General Details
                </h5>

                <div className=' row mt-3 m-0'>
                    <main className='px-3 d-flex align-items-center'>
                        <input type='checkbox' className='myCheckBox inputElement' onChange={(e) => { onChangeHandler(e) }} name="enableUser" />
                        <label className='ms-2 myLabel' htmlFor="">Enable user </label>
                    </main>
                    <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                        <label className='myLabel' htmlFor="email">First Name </label>
                        <input value={userData.firstName} className='myInput inputElement' autoComplete='false' onChange={(e) => { onChangeHandler(e) }} type="text" name="firstName" />
                    </section>
                    <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                        <label className='myLabel' htmlFor="email">Last Name</label>
                        <input value={userData.lastName} className='myInput inputElement' autoComplete='false' onChange={(e) => { onChangeHandler(e) }} type="text" name="lastName" />
                    </section>
                    <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                        <label className='myLabel' htmlFor="email">Email address</label>
                        <input value={userData.email} className='myInput inputElement' autoComplete='false' onChange={(e) => { onChangeHandler(e) }} type="text" name="email" />
                    </section>
                    <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                        <label className='myLabel' htmlFor="email">Phone Number</label>
                        <input value={userData.phoneNumber} className='myInput inputElement' autoComplete='false' onChange={(e) => { onChangeHandler(e) }} type="number" name="phoneNumber" />
                    </section>
                    <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                        <label className='myLabel' htmlFor="password">{workFor === 'forAdd' ? 'Password' : 'New password'}</label>
                        <input value={userData.password} className='myInput inputElement' autoComplete='false' onChange={(e) => { onChangeHandler(e) }} type="password" name="password" />
                    </section>
                    {/* <section className='d-flex mt-3 flex-column col-12'>
                        <label className='myLabel' htmlFor="password">Confirm Password </label>
                        <input className='inputElement' autoComplete='false' onChange={(e) => { onChangeHandler(e) }} type="password" name="confirmPassword" />
                    </section> */}


                </div>
            </main>
            <main className='mt-4'>
                <h5 className='m-0'>{workFor === 'forAdd' ? 'Select roles' : 'Edit roles'}</h5>
                <div className=' row m-0'>
                    <section className='d-flex mt-3 flex-column selectRole col-12'>
                        <label className='myLabel'>Select one or more roles</label>
                        <div className='d-flex flex-column flex-md-row mt-2'>
                            <main >
                                <label className='pb-2' >Available roles ({roles && roles.length > 0 ? roles.length : 0})</label>
                                <select name='selectRole' onChange={(e) => selectChangeCall(e)} ref={selectInp} className='inputElement' multiple>
                                    {
                                        roles.length > 0 && roles.map((item, index) => {
                                            return <option className='text-uppercase' key={index} name={item.role} value={item.id}>{item.role}</option>
                                        })
                                    }
                                </select>
                            </main>

                            <div className='d-flex flex-row flex-md-column justify-content-around allBtnsMain m-3'>
                                <div ref={rightArrowBtn} className='arrowBtn disabledBtn' name='rightDiv' onClick={rightClick}>
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                                    </svg> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg>
                                </div>
                                <div ref={leftArrowBtn} className='arrowBtn disabledBtn' onClick={leftClick}>

                                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                                    </svg> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                    </svg>
                                </div>
                            </div>

                            <main >
                                <label className='pb-2' >Selected ({userData && userData.role.length > 0 ? userData.role.length : 0})</label>

                                <select onChange={(e) => selectChangeCall(e)} ref={selectedInp} className='inputElement' name='selectedRole' multiple>
                                    {
                                        getRoleName.map((item, index) => {
                                            return <option className='text-uppercase' key={index} >{item}</option>
                                        })
                                    }
                                </select>
                            </main>
                        </div>
                    </section>
                    <section className='d-flex mt-3  flex-column flex-sm-row'>
                        <button className='col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handleSubmit} type='button'>{workFor === 'forAdd' ? 'Add user' : 'Edit user'}</button>
                        <button className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handleCancel} type='button'>Cancel</button>
                    </section>
                </div>
            </main>
        </div >
    )
}
