import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFeatureFromDb } from '../redux/slices/getFeatureSlice'
import { addRoleToDb, clearAddRoleState } from '../redux/slices/addRoleSlice'
import { editRoleToDb, clearEditRoleState } from '../redux/slices/editRoleDataSlice'
import Axios from 'axios'
import { getToPathname } from '@remix-run/router'
import { setShowMessage } from '../redux/slices/notificationSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Modal, Button } from "react-bootstrap";


export default function AddRole({ workFor }) {
    const location = useLocation();
    const tableEditData = location.state
    // console.log(tableEditData,"tableEditDatatableEditData")
    const [featuresList, setFeaturesList] = useState([])
    const [showRolesList, setShowRolesList] = useState([])
    const [checkedd, setChecked] = useState(false);
    const [role_emp, setRole_emp] = useState(0);
    // console.log("ddddddd",checkedd)
    const [currentRole, setCurrentRole] = useState({
        role: null,
        features: null,

    })

    const [featureData, setFeatureData] = useState({
        roleName: '',
        roleDescription: '',
        checkedFeatures: [],
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const featuresState = useSelector(state => state.featuresListState.featuresState)
    const addRoleState = useSelector(state => state.addRoleState.addRoleState)
    const editRoleState = useSelector(state => state.editRoleDataState.editRoleSliceState)

    const handleCheckboxChange = () => {
        setChecked(!checkedd);
        setRole_emp(1)
    };
   
    useEffect(() => {
        if (workFor === "forEdit") {
            setFeatureData({
                roleName: tableEditData.role,
                roleDescription: tableEditData.description,
                checkedFeatures: [],
            })
        }
    }, [workFor])

    useEffect(() => {
        // console.log('editRoleState', editRoleState);
        if (editRoleState.isSuccess) {
            if (editRoleState.message.isSuccess && editRoleState.message.result === 'success') {
                dispatch(setShowMessage('Success'))
                dispatch(clearEditRoleState())
                clearInpHook()
                navigate("/administration/roles");
            }
        }

    }, [editRoleState])

    function clearInpHook() {
        setFeatureData({
            roleName: '',
            roleDescription: '',
            checkedFeatures: [],
        })
        // setChecked(false)
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
        getRoleEmp();
    }, [])
    const getRoleEmp = async () => {
        const RoleForEmp = tableEditData.id;
        const url = `${process.env.REACT_APP_NODE_URL}/api/users/getRoleDesc/${RoleForEmp}`;
        const config = {
            headers: {
                token: localStorage.getItem("rbacToken"),
            },
        };
        await Axios.get(url, config).then((response) => {
            if (response.data?.isSuccess) {
                setRole_emp(response.data.result[0].role_emp);
                // console.log(response.data.result, "6666666666666666666666666")
                if (response.data.result[0].role_emp == 1) {
                    setChecked(true)
                } else {
                    setChecked(false)
                }
            }
        });
    }
    useEffect(() => {
        if (workFor === 'forEdit') {
            clearInpHook()
            if (currentRole.role !== null) {
                setFeatureData({
                    roleName: tableEditData.role,
                    roleDescription: tableEditData.description,
                    checkedFeatures: [],
                })
            }
            if (currentRole.features !== null) {
                // console.log('currentRole.features', currentRole.features)
                let tempAr = [];
                currentRole.features.forEach((target) => {
                    // console.log('getElementsByName', document.getElementsByName(`${target.feature}Inp`)[0]);
                    document.getElementsByName(`${target.feature}Inp`)[0].checked = true
                    tempAr.push(target.id)
                })
                setFeatureData(featureData => ({ ...featureData, checkedFeatures: tempAr }))

            }
        }

    }, [currentRole])

    useEffect(() => {
        clearInpHook()
        if (workFor === 'forEdit') {
            getRoles()
        }
    }, [workFor])
    useEffect(() => {
        if (addRoleState.isSuccess) {
            if (addRoleState.message.isSuccess) {
                dispatch(setShowMessage('Role is created'))
                dispatch(clearAddRoleState())
                navigate('/administration/roles')
                clearInpHook()
                clearAddRoleState()
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
        dispatch(getFeatureFromDb())
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

    async function getRoles() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/roles/get-roles-to-edit`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await Axios.get(url, config).then((response) => {
            if (response.data?.isSuccess) {
                setShowRolesList(response.data.result)
                // console.log('get-roles-to-edit result>', response.data.result);
            }
        })
    }
    async function getRoleFeatures(roleId) {
        const url = `${process.env.REACT_APP_NODE_URL}/api/roles/get-roles-features`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await Axios.post(url, { roleId: roleId }, config).then((response) => {
            if (response.data?.isSuccess) {
                // setShowRolesList(response.data.result)
                setCurrentRole(currentRole => ({ ...currentRole, features: response.data.result }))
            }
        })
    }
    function handleSubmit() {
        //console.log('featureData', featureData);
        //console.log('currentRole', currentRole);
        // console.log('role_emp', role_emp);

        const updatedObject = {
            ...featureData,
            role_emp: role_emp
        };
        //setFeatureData(updatedObject)
        //console.log('featureDatanewwwww', featureData);
        if (workFor === 'addRole') {
            if (featureData.roleName != '' && featureData.checkedFeatures.length > 0) {
                console.log(updatedObject, "updatedObject");
                dispatch(addRoleToDb(updatedObject))
            } else {
                dispatch(setShowMessage('Please fill all the field'))
            }
        } else {
            if (workFor === 'forEdit') {
                //console.log("editnow")
                // console.log(currentRole, 'current')
                //  console.log(featureData.roleDescription)
                //  console.log(featureData.checkedFeatures)
                //  console.log(tableEditData.id)
                if (currentRole != null) {
                    let myData = {
                        description: featureData.roleDescription,
                        features: featureData.checkedFeatures,
                        id: tableEditData.id,
                    }
                    dispatch(editRoleToDb(myData))
                }
            }


        }
    }
    function handleSelectRole() {
        // console.log('handleSelectRole', e.target.selectedOptions[0].value);
        clearInpHook()
        let tempObj = showRolesList.find((item) => {
            return item.id == tableEditData.id
        })
        setCurrentRole(currentRole => ({ ...currentRole, role: tempObj }))
        getRoleFeatures(tableEditData.id)

    }
    function handlCancel() {
        // console.log(featureData.roleDescription);
        navigate('/administration/roles')
        clearInpHook()
    }

    const getEdit = () => {
        if (workFor === 'forEdit') {
            setFeatureData({
                roleName: tableEditData.role,
                roleDescription: tableEditData.description,
                checkedFeatures: [],
            })
        }

    }
    useEffect(() => {
        if (workFor === 'forEdit') {
            getEdit();
            handleSelectRole()
        }
    }, [])

    const redirectModal = () => {
        navigate(-1);
    };

    return (
        <div className='addUser myBorder bg-white rounded p-3'>
            <div className=' row m-0'>
                {

                    workFor === 'roles' && <div className='  d-flex align-items-end justify-content-end'>
                        <div onClick={() => { navigate('/administration/roles') }} className='d-flex align-items-center' type='button'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                            <h6 className='m-0 ps-1'>
                                Add role
                            </h6>
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
                    </div>
                }
            </div>
            <main>
                <div className=' row m-0'>
                    <div className="d-flex justify-content-between">
                        <h5 className='m-0'>
                            {
                                workFor === 'addRole' ? 'Create role' : 'Edit role'
                            }
                        </h5>
                        <div className=''>
                            <input
                                type="checkbox"
                                checked={checkedd}
                                onChange={handleCheckboxChange}
                            />
                            <label className='ms-1'>Role for Employee</label>

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
                    </div>



                    {
                        workFor === 'forEdit' ? <section className='d-flex  flex-column col-12 col-lg-5'>
                            <label className='myLabel' htmlFor="email">Select role</label>
                            {/* <select className='myInput' name="selectRole">
                                <option value='0' className='myLabel' selected>select role</option>
                                {
                                    showRolesList && showRolesList.length > 0 && showRolesList.map((item, index) => {
                                        return <option key={index} value={item.id}>{item.role}</option>
                                    })
                                }
                            </select> */}
                            <input disabled className='myInput' name="selectRole" value={featureData.roleName} />
                        </section>
                            : <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                <label className='myLabel' htmlFor="email">Role name</label>
                                <input className='myInput inputElement' autoComplete='false' onChange={(e) => { onChangeHandler(e) }} type="text" name="roleName" />
                            </section>
                    }

                </div>
                <div className=' row m-0'>
                    <section className='d-flex mt-3 flex-column col-12'>
                        <label className='myLabel' htmlFor="email">Role description</label>
                        <textarea rows='5' value={featureData.roleDescription} className='myInput inputElement' autoComplete='false' onChange={(e) => { onChangeHandler(e) }} type="text" name="roleDescription" />
                    </section>

                    <section className='d-flex mt-3 flex-column featureTree'>
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

                        <ul className='mt-3 m-0'>
                            {
                                featuresList && featuresList.length > 0 && featuresList.map((data, index) => {

                                    return <li key={index}>
                                        {/* <label className='myLabel fw-bold' htmlFor="email"></label> */}
                                        <div className='pb-3 d-flex align-items-center'>
                                            <input type='checkbox' className='myCheckBox inputElement' onChange={(e) => { onChangeHandler(e, data.id) }} name={`${data.feature}Inp`} />
                                            <label className='ms-2 myLabel' htmlFor="">{data.label}</label>
                                        </div>
                                    </li>
                                })
                            }
                        </ul>
                    </section>

                    <section className='d-flex flex-column flex-sm-row'>
                        <button className='col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handleSubmit} type='button'>{workFor === 'addRole' ? 'Create role' : 'Save'} </button>
                        <button className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handlCancel} type='button'>Cancel </button>

                    </section>

                </div>


            </main>
        </div >
    )
}
