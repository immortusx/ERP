import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addUserToDb, clearAddUserState } from '../redux/slices/addUserSlice'
import { clearEditUserState, clearEditUserData, editUserUpdateToDb } from '../redux/slices/editUserDataSlice'
import '../styles/AddUser.css'
import Axios from 'axios'
import { Modal, Button } from "react-bootstrap";
import { getToPathname } from '@remix-run/router'
import { setShowMessage } from '../redux/slices/notificationSlice'
import { useNavigate } from 'react-router-dom'

import Checkbox from '@mui/material/Checkbox'

import SwapSection from './SwapSection'

export default function AddUser({ workFor }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const addUserState = useSelector(state => state.addUserSlice.addUserState)
    const { editUserSliceState } = useSelector(state => state.editUserDataState)
    const editUserData = useSelector(state => state.editUserDataState.editUserData.data)

    const [roles, setRoles] = useState([])
    const [branches, setBranchs] = useState([])
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
    })

    const [popUpScreen, setPopUpScreen] = useState(false)
    const [branchRoles, setBranchRoles] = useState({})
    const [branchId, setBranchId] = useState()

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
                navigate('/administration/users')

            } else {
                dispatch(setShowMessage('Something is wrong!'))
            }
        }
    }, [editUserSliceState])
    const redirectModal = () => {
        navigate(-1);
    };
    function handleSubmit() {
        console.log('userData', userData)
        console.log('branchRoles', branchRoles)
        const fN = userData.firstName;
        const lN = userData.lastName;
        const email = userData.email;
        const pass = userData.password;
        const pN = userData.phoneNumber;

        if (fN.length > 0 &&
            lN.length > 0 &&
            email.length > 0 &&
            pN.length > 0 &&
            (workFor === 'forAdd' ? pass.length > 0 : true) &&
            Object.keys(branchRoles).length > 0) {
            userData['branchRole'] = branchRoles
            if (workFor === 'forEdit') {
                userData['id'] = editUserData.id
                dispatch(editUserUpdateToDb(userData))
            } else {
                dispatch(addUserToDb(userData))
            }
        } else {
            dispatch(setShowMessage('All field must be field'))
        }

    }
    async function getUserBranchRole(id) {
        const url = `${process.env.REACT_APP_NODE_URL}/api/users/get-user-details/${id}`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await Axios.get(url, config).then((response) => {
            if (response.data?.isSuccess) {
                setBranchRoles(response.data.result)
            }
        })


    }
    useEffect(() => {
        if (branches.length > 0 && workFor === 'forEdit' && editUserData) {
            const id = editUserData.id
            getUserBranchRole(id)
        }
    }, [branches])
    useEffect(() => {
        if (workFor === 'forEdit') {
            if (editUserData === null) {
                dispatch(setShowMessage('Please select a user'))
                setTimeout(() => {
                    navigate('/administration/users')
                }, 1000)
            } else {
                setUserData({
                    firstName: editUserData.first_name,
                    lastName: editUserData.last_name,
                    email: editUserData.email,
                    password: '',
                    phoneNumber: editUserData.phone_number,
                })
            }
        }
        return () => {
            if (workFor === 'forEdit') {
                dispatch(clearEditUserData())
            }
        }
    }, [workFor, editUserData])


    function clearInpHook() {
        setUserData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNumber: '',
        })
        setBranchRoles({})
        const allInp = document.getElementsByClassName('inputElement')
        Array.from(allInp).forEach((item) => {
            item.value = ''
        })
    }
    async function getRolesFromDb() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/users/roles-list`;
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
    async function getBranchsFromDb() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/users/branches-list`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await Axios.get(url, config).then((response) => {
            if (response.data?.isSuccess) {

                setBranchs(response.data.result)
            }
        })
    }
    useEffect(() => {
        if (addUserState.isSuccess) {
            if (addUserState.message.result === 'success') {
                dispatch(setShowMessage('User is created'))
                clearInpHook()
                dispatch(clearAddUserState())
                navigate('/administration/users')
            } else if (addUserState.message.result === 'alreadyExist') {
                dispatch(setShowMessage('Please use a different email to continue!'))
                dispatch(clearAddUserState())
            } else {
                dispatch(setShowMessage('Something is wrong!'))
            }
        }
    }, [addUserState])
    useEffect(() => {
        getBranchsFromDb()
        getRolesFromDb()

    }, [])


    function makeSelected(e, side, item) {
        if (side === 'rightSide') {
            rightArrowBtn.current.classList.remove('disabledBtn')
            Array.from(selectInp.current.childNodes).forEach(i => {
                i.classList.remove('checked')
            })
        } else {
            Array.from(selectedInp.current.childNodes).forEach(i => {
                i.classList.remove('checked')
            })
            leftArrowBtn.current.classList.remove('disabledBtn')
        }
        e.currentTarget.classList.add('checked')
    }

    function editBranchRole() {

        const itemList = selectedInp.current
        const selectedItems = itemList.getElementsByClassName('checked');
        const checkId = selectedItems[0].value
        setBranchId(checkId)
        setPopUpScreen(true)
    }
    function rightClick() {
        let tempAr = []

        const itemList = selectInp.current
        const selectedItems = itemList.getElementsByClassName('checked');
        const checkId = selectedItems[0].value
        setBranchId(checkId)
        setPopUpScreen(true)

        Array.from(selectInp.current.childNodes).forEach(i => {
            i.classList.remove('checked')
        })

        rightArrowBtn.current.classList.add('disabledBtn')
    }

    function leftClick() {
        const itemList = selectedInp.current
        const selectedItems = itemList.getElementsByClassName('checked');
        const checkId = selectedItems[0].value
        let newResult = Array.from(branchRoles).filter((item) => {
            return item != checkId
        })
        let tempObj = { ...branchRoles }
        delete tempObj[checkId]
        setBranchRoles(tempObj)

        Array.from(selectedInp.current.childNodes).forEach(i => {
            i.classList.remove('checked')
        })
        leftArrowBtn.current.classList.add('disabledBtn')
    }

    function handleCancel() {
        navigate('/administration/users')
    }
    function onChangeHandler(e) {
        const name = e.target.name;
        const value = e.target.value;
        setUserData({ ...userData, [name]: value })
    }

    function callBackLeft(checkId) {
        const tempAr = branchRoles[branchId]
        const newAr = tempAr.filter(i => { return i != checkId })
        if (Object.keys(branchRoles).length == 1 && Object.values(branchRoles)[0].length == 1) {
            setBranchRoles({})
        } else {

            setBranchRoles(branchRoles => ({ ...branchRoles, [branchId]: newAr }))
        }
    }
    function callBackFun(checkId) {
        const tempAr = [];
        if (branchRoles[branchId] != undefined) {
            if (branchRoles[branchId] && !branchRoles[branchId].includes(checkId)) {
                branchRoles[branchId].forEach(i => {
                    tempAr.push(i)
                })
                tempAr.push(checkId)
                setBranchRoles(branchRoles => ({ ...branchRoles, [branchId]: tempAr }))
            }
        } else {
            tempAr.push(checkId)
            setBranchRoles(branchRoles => ({ ...branchRoles, [branchId]: tempAr }))
        }
    }

    const connectedBranch = useMemo(() => {
        let tempCounter = 0;
        Object.keys(branchRoles).forEach((item, index) => {
            let findBranch = branches.find(i => {
                return i.id == item
            })
            console.log('findBranch', findBranch)
            if (findBranch) {
                tempCounter++
            }
        })
        return tempCounter

    }, [branchRoles])
    const showSelectedData = useMemo(() => {
        let tempAr = []
        if (Object.keys(branchRoles).length > 0) {

            Object.keys(branchRoles).forEach((item, index) => {
                let tempObj = {}
                let findBranch = branches.find(i => {
                    return i.id == item
                })
                if (findBranch) {
                    tempObj['branch'] = findBranch
                    let tempArNested = []
                    branchRoles[item].forEach(i => {
                        let result = roles.find(roleItem => {
                            return i == roleItem.id
                        })
                        tempArNested.push(result)
                    })
                    tempObj['role'] = tempArNested
                    tempAr.push(tempObj)
                }
            })
        }
        return tempAr

    }, [branchRoles])

    function confirmClicked() {
        setPopUpScreen(false)
    }

    return (
        <>
            <div className='addUser  bg-white rounded p-3'>
                <main>
                    <div className="d-flex align-items-center justify-content-between">
                        <h5 className='m-0'>
                            General Details
                        </h5>
                        <Button
                            variant="btn btn-warning mx-1"
                            style={{ width: '70px', height: '35px', fontSize: '14px', borderRadius: '20px' }}
                            onClick={() => {
                                redirectModal();
                            }}
                        >
                            BACK
                        </Button>
                    </div>
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
                            <input value={userData.phoneNumber} className='myInput inputElement' autoComplete='false' onChange={(e) => { onChangeHandler(e) }} type="text" name="phoneNumber" />
                        </section>
                        <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                            <label className='myLabel' htmlFor="password">{workFor === 'forAdd' ? 'Password' : 'New password'}</label>
                            <input value={userData.password} className='myInput inputElement' autoComplete='false' onChange={(e) => { onChangeHandler(e) }} type="password" name="password" />
                        </section>



                    </div>
                </main>
                <main className='mt-4'>
                    <h5 className='m-0'>{workFor === 'forAdd' ? 'Select branch' : 'Edit branch'}</h5>
                    <div className=' row m-0'>
                        <section className='d-flex mt-3 flex-column  col-12'>
                            <label className='myLabel'>Select one or more branch</label>
                            <div className='swapSelection d-flex flex-column flex-md-row mt-2'>
                                <main >
                                    <label className='pb-2' >Available branches ({branches && branches.length > 0 ? branches.length : 0})</label>
                                    <ul ref={selectInp} name='selectRole' className='inputElement'>
                                        {
                                            branches.length > 0 && branches.map((item, index) => {
                                                return <li onClick={(event) => { makeSelected(event, 'rightSide', item) }} className='text-uppercase' key={index} value={item.id}>
                                                    <div className='d-flex align-items-center'>
                                                        {/* <input type='checkbox' className='m-2 myCheckBox inputElement' onChange={(e) => { onChangeHandler(e) }} name="enableUser" /> */}
                                                        <p className='ms-1'>
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                </li>
                                            })
                                        }
                                    </ul>
                                </main>

                                <div className='d-flex flex-row flex-md-column justify-content-around allBtnsMain m-3'>
                                    <div ref={rightArrowBtn} className='arrowBtn disabledBtn' name='rightDiv' onClick={rightClick}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                        </svg>
                                    </div>
                                    <div ref={leftArrowBtn} className='arrowBtn disabledBtn' onClick={leftClick}>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                        </svg>
                                    </div>
                                </div>
                                <main >
                                    <label className='pb-2' >Selected ({branchRoles && Object.keys(branchRoles).length ? connectedBranch : 0})</label>

                                    <ul ref={selectedInp} className='inputElement' name='selectedRole'>
                                        {
                                            branchRoles && Object.keys(branchRoles).length > 0 && showSelectedData.map((item, index) => {
                                                return <>
                                                    <li value={item.branch.id} onDoubleClick={editBranchRole} onClick={(event) => { makeSelected(event, 'leftSide', item.branch.id) }} className='text-uppercase' key={index} >
                                                        <div className='d-flex flex-wrap align-items-center  justify-content-between'>
                                                            {item.branch.name}

                                                            <div className='d-flex flex-wrap'>
                                                                {item.role.map((i, index) => {
                                                                    return <span key={index} value={i.id} className='myTag myH7 m-1'>{i.role}</span>
                                                                })}
                                                            </div>
                                                        </div>
                                                    </li>
                                                </>
                                            })
                                        }
                                    </ul>
                                </main>
                            </div>
                        </section>
                        <section className='d-flex mt-3  flex-column flex-sm-row'>
                            <button className='col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handleSubmit} type='button'>{workFor === 'forAdd' ? 'Add user' : 'Save'}</button>
                            <button className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handleCancel} type='button'>Cancel</button>
                        </section>
                    </div>
                </main>
            </div >
            {
                popUpScreen && <section className='popUpScreen'>
                    <main className='shadow col-10 col-md-8 col-lg-7  p-3'>

                        <h5 className='m-0'>Select role</h5>
                        <div className=' row m-0'>
                            <section className='d-flex mt-3 flex-column col-12'>
                                <label className='myLabel'>Select one or more roles</label>
                                <SwapSection workFor='roles' currentId={branchId} selectedData={branchRoles} setSelectedData={setBranchRoles} callBackLeft={callBackLeft} callBackFun={callBackFun} selectionData={roles} />
                            </section>
                            <section className='d-flex mt-3  flex-column flex-sm-row'>
                                <button onClick={confirmClicked} className='col-12 col-sm-5 col-lg-2 myBtn py-2' type='button'>Done</button>
                                {/* <button onClick={cancelClicked} className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2' type='button'>Cancel</button> */}
                            </section>
                        </div>
                    </main>
                </section>
            }
        </>
    )
}
