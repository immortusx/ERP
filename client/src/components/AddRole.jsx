import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFeatureFromDb } from '../redux/slices/getFeatureSlice'
import { addRoleToDb, clearAddRoleState } from '../redux/slices/addRoleSlice'
import Axios from 'axios'
import { getToPathname } from '@remix-run/router'
import { setShowMessage } from '../redux/slices/notificationSlice'


export default function AddRole() {
    const [featuresList, setFeaturesList] = useState([])
    const dispatch = useDispatch()
    const featuresState = useSelector(state => state.featuresListState.featuresState)
    const addRoleState = useSelector(state => state.addRoleState.addRoleState)

    const [featureData, setFeatureData] = useState({
        roleName: '',
        roleDescription: '',
        checkedFeatures: [],
    })

    function clearInpHook() {
        setFeatureData({
            roleName: '',
            roleDescription: '',
            checkedFeatures: [],
        })
        const allInp = document.getElementsByClassName('inputElement')
        Array.from(allInp).forEach((item) => {
            if (item.type === 'checkbox') {
                item.checked = false
            } else {
                item.value = ''
            }
        })
    }

    useEffect(() => {
        if (addRoleState.isSuccess) {
            if (addRoleState.message.isSuccess) {
                dispatch(setShowMessage('Role is created'))
                
                clearInpHook()
            } else {
                dispatch(setShowMessage('Something is wrong'))
            }

        }
    }, [addRoleState])
    useEffect(() => {
        if (featuresState.isSuccess) {
            if (featuresState.data.isSuccess) {
                setFeaturesList(featuresState.data.result)
            }

        }
    }, [featuresState])
    useEffect(() => {
        dispatch(getFeatureFromDb('hello'))
    }, [])
    function onChangeHandler(data, id) {
        let tempAr = [];
        const value = data.target.value
        const name = data.target.name
        const checked = data.target.checked

        featureData.checkedFeatures.forEach((i) => {
            tempAr.push(i)
        })
        if (id === undefined) {
            setFeatureData(featureData => ({ ...featureData, [name]: value }))
        } else {
            if (checked) {

                tempAr.push(id)
                setFeatureData(featureData => ({ ...featureData, checkedFeatures: tempAr }))
            } else {
                tempAr = tempAr.filter((i) => {
                    return i != id;
                })
                setFeatureData(featureData => ({ ...featureData, checkedFeatures: tempAr }))
            }
        }
    }
    function handleSubmit() {
        console.log('featureData', featureData);
        if (featureData.roleName != '' && featureData.checkedFeatures.length > 0) {
            dispatch(addRoleToDb(featureData))
        } else {
            dispatch(setShowMessage('Please fill all the field'))
        }
    }


    return (
        <div className='addUser bg-white rounded p-3'>
            <main>
                <h5 className='m-0'>
                    Create Role
                </h5>

                <div className=' row mt-3 m-0'>
                    <section className='col-12 col-sm-6'>
                        <label className='myLabel' htmlFor="email">Role name</label>
                        <input className='myInput inputElement' autoComplete='false' onChange={(e) => { onChangeHandler(e) }} type="text" name="roleName" />
                    </section>
                    <section className='col-12 col-sm-6'>
                        <label className='myLabel' htmlFor="email">Role description</label>
                        <input className='myInput inputElement' autoComplete='false' onChange={(e) => { onChangeHandler(e) }} type="text" name="roleDescription" />
                    </section>

                    <section className='featureTree'>
                        {/* prototype of tree structure */}
                        {/* <ul>
                            <li>
                                <label className='myLabel fw-bold' htmlFor="email">USERS</label>
                                <div>
                                    <input type='checkbox' className='myCheckBox inputElement' onChange={(e) => { onChangeHandler(e) }} name="enableUser" />
                                    <label className='ms-2 myLabel' htmlFor="">1.1</label>
                                </div>
                            </li>
                            <li>
                                <label className='myLabel fw-bold' htmlFor="email">Profile</label>
                                <div>
                                    <input type='checkbox' className='myCheckBox inputElement' onChange={(e) => { onChangeHandler(e) }} name="enableUser" />
                                    <label className='ms-2 myLabel' htmlFor="">2.1</label>
                                </div>
                            </li>
                            <ul>
                                <li>
                                    <div>
                                        <input type='checkbox' className='myCheckBox inputElement' onChange={(e) => { onChangeHandler(e) }} name="enableUser" />
                                        <label className='ms-2 myLabel' htmlFor="">2.1.1</label>
                                    </div>
                                </li>
                                <ul>
                                    <li>
                                        <div>
                                            <input type='checkbox' className='myCheckBox inputElement' onChange={(e) => { onChangeHandler(e) }} name="enableUser" />
                                            <label className='ms-2 myLab el' htmlFor="">2.1.1.1 </label>
                                        </div>
                                    </li>
                                </ul>
                            </ul>
                            <li>
                                <label className='myLabel fw-bold' htmlFor="email">Products</label>
                                <div>
                                    <input type='checkbox' className='myCheckBox inputElement' onChange={(e) => { onChangeHandler(e) }} name="enableUser" />
                                    <label className='ms-2 myLabel' htmlFor="">3.1</label>
                                </div>
                            </li>
                        </ul> */}

                        <ul className='m-0'>
                            {
                                featuresList && featuresList.length > 0 && featuresList.map((data, index) => {

                                    return <li key={index}>
                                        <label className='myLabel fw-bold' htmlFor="email"></label>
                                        <div className='d-flex align-items-center'>
                                            <input type='checkbox' className='myCheckBox inputElement' onChange={(e) => { onChangeHandler(e, data.id) }} name={data.feature} />
                                            <label className='ms-2 myLabel' htmlFor="">{data.label}</label>
                                        </div>
                                    </li>
                                })
                            }
                        </ul>
                    </section>


                    <section>
                            <button className='col-12 col-sm-3 myBtn py-2' onClick={handleSubmit} type='button'>Create role</button>
                    </section>

                </div>
            </main>
        </div >
    )
}
