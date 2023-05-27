import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFeatureFromDb } from '../redux/slices/getFeatureSlice'
import { addRoleToDb, clearAddRoleState } from '../redux/slices/addRoleSlice'
import { editRoleToDb, clearEditRoleState } from '../redux/slices/editRoleDataSlice'
import Axios from 'axios'
import { getToPathname } from '@remix-run/router'
import { setShowMessage } from '../redux/slices/notificationSlice'
import { useNavigate } from 'react-router-dom'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';



export default function AddRole({ workFor }) {
    const [featuresList, setFeaturesList] = useState([])
    const [showRolesList, setShowRolesList] = useState([])
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

    useEffect(() => {
        console.log('editRoleState', editRoleState);
        if (editRoleState.isSuccess) {
            if (editRoleState.message.isSuccess && editRoleState.message.result === 'success') {
                dispatch(setShowMessage('Success'))
                dispatch(clearEditRoleState())
                clearInpHook()
            }
        }

    }, [editRoleState])

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
        if (workFor === 'roles') {
            clearInpHook()
            if (currentRole.role !== null) {
                setFeatureData({
                    roleName: '',
                    roleDescription: currentRole.role.description,
                    checkedFeatures: [],
                })
            }
            if (currentRole.features !== null) {
                console.log('currentRole.features', currentRole.features)
                let tempAr = [];
                currentRole.features.forEach((target) => {
                    console.log('getElementsByName', document.getElementsByName(`${target.feature}Inp`)[0]);
                    document.getElementsByName(`${target.feature}Inp`)[0].checked = true
                    tempAr.push(target.id)
                })
                setFeatureData(featureData => ({ ...featureData, checkedFeatures: tempAr }))

            }
        }

    }, [currentRole])

    useEffect(() => {
        clearInpHook()

        if (workFor === 'roles') {
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
        if (featuresList && featuresList.length > 0) {
            console.log(featuresList, 'feature')
        }
    }, [])
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
                console.log('get-roles-to-edit result', response.data.result);
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
        console.log('featureData', featureData);
        console.log('currentRole', currentRole);
        if (workFor === 'addRole') {
            if (featureData.roleName != '' && featureData.checkedFeatures.length > 0) {
                dispatch(addRoleToDb(featureData))
            } else {
                dispatch(setShowMessage('Please fill all the field'))
            }
        } else {
            if (currentRole.role != null) {

                console.log('workFor', workFor);
                let myData = {
                    description: featureData.roleDescription,
                    features: featureData.checkedFeatures,
                    id: currentRole.role.id,
                }
                dispatch(editRoleToDb(myData))
            }

        }
    }
    function handleSelectRole(e) {
        console.log('handleSelectRole', e.target.selectedOptions[0].value);
        clearInpHook()
        if (e.target.selectedOptions[0].value == 0) {
            console.log('******handle if 0 selected******')
        } else {
            let tempObj = showRolesList.find((item) => {
                return item.id == e.target.selectedOptions[0].value
            })
            setCurrentRole(currentRole => ({ ...currentRole, role: tempObj }))
            getRoleFeatures(e.target.selectedOptions[0].value)
        }
    }
    function handlCancel() {
        console.log('handlCancel');
        navigate('/administration/roles')
        clearInpHook()
    }


    const columns = [
        {
            field: 'id',
            headerAlign: 'center',
            align: 'center',
            headerName: 'No',
            minWidth: 80,
            flex: 1,
        },

        {
            field: 'role',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Roles',
            minWidth: 120,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.role ? params.row.role : '-'}`
            }
        },
        {
            field: 'description',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Role description',
            minWidth: 250,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.description ? params.row.description : '-'}`
            }
        },

        {
            field: 'actions',
            headerName: 'Actions',
            className: 'bg-dark',
            sortable: false,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
            disableColumnMenu: true,
            minWidth: 80,
            flex: 1,
            position: 'sticky',
            renderCell: (params) => (
                <div>
                    {/* <button onClick={() => { editActionCall(params.row) }} className='myActionBtn m-1'> */}
                    <button className='myActionBtn m-1'
                    // onClick={() => { editeStateModal(params.row) }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </button>
                    {/* <button className='myActionBtn m-1'
                        onClick={() => { deleteStateAlert(params.row) }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                        </svg>
                    </button> */}
                </div>
            ),
        }
    ];
    return (
        <div className='addUser myBorder bg-white rounded p-3'>
            <div className=' row mt-3 m-0'>
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
                        </div>
                    </div>
                }
                {/* <div className='mt-2' style={{ height: '85vh', width: '100%' }}>
                    <DataGrid
                        rows={showRolesList}
                        columns={columns}
                        getRowId={(params) => {
                            return params.id
                        }}
                        className='rounded'
                        style={{ fontFamily: 'Poppins', padding: 5, backgroundColor: 'white', }}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            //  ...allStateDate.initialState,
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        components={{
                            Toolbar: GridToolbar,
                            NoRowsOverlay: () => (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span>There is no Users with current branch</span>
                                </div>)
                        }}
                        componentsProps={{
                            toolbar: {
                                position: 'right',
                                style: { fontFamily: 'Poppins', alignSelf: 'end' },
                            },
                        }}
                        rowSelection={false}
                        autoPageSize={false}
                    />
                </div> */}
            </div>
            <main>
                <div className=' row mt-3 m-0'>

                    <h5 className='m-0'>
                        {
                            workFor === 'addRole' ? 'Create role' : 'Edit role'
                        }
                    </h5>


                    {
                        workFor === 'roles' ? <section className='d-flex  flex-column col-12 col-lg-5'>
                            <label className='myLabel' htmlFor="email">Select role</label>
                            <select onChange={handleSelectRole} className='myInput' name="selectRole">
                                <option value='0' className='myLabel' selected>select role</option>
                                {
                                    showRolesList && showRolesList.length > 0 && showRolesList.map((item, index) => {
                                        return <option key={index} value={item.id}>{item.role}</option>
                                    })
                                }
                            </select>
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
                        <button className='col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handleSubmit} type='button'>{workFor === 'addRole' ? 'Create role' : 'Edit role'} </button>
                        <button className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handlCancel} type='button'>Cancel </button>

                    </section>

                </div>


            </main>
        </div >
    )
}
