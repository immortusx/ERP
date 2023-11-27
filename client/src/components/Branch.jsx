import React, { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AlertDeleteModal from './AlertDelete/AlertDeleteModal'
import '../styles/Branch.css'
import { Modal, Button } from "react-bootstrap";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Checkbox from '@mui/material/Checkbox'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Tooltip } from "@mui/material";
import SwapSection from './SwapSection'
import translations from '../assets/locals/translations'
import moment from 'moment'


import { useSelector, useDispatch } from 'react-redux'

import { setShowMessage } from '../redux/slices/notificationSlice'
import Switch from '@mui/material/Switch';
import State from './singleComponents/villageCom/state'
import District, { getDistrictList } from './singleComponents/villageCom/District'
import Taluka from './singleComponents/villageCom/Taluka'
import Village from './singleComponents/villageCom/village'


export default function Branch({ workFor }) {
    const currentLanguage = useSelector((state) => state.language.language);
    const [displayConfirmationModal, setDisplayConfirmationModal] =
        useState(false);
    const [type, setType] = useState(null);
    const [id, setId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const dispatch = useDispatch()
    const [branchList, setBranchsList] = useState([])
    const [talukaList, setTalukaList] = useState([])
    const [villageList, setVillageList] = useState([])
    const [stateList, setStateList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [branchDeleteId, setBranchDeleteId] = useState(null);
    const [branchData, setBranchData] = useState({
        address: "",
        code: "",
        contactPerson: "",
        description: "",
        email: "",
        firmName: "",
        gstNumber: "",
        mobileNumber: "",
        state: "",
        district: "",
        taluka: "",
        village: "",

    })
    const [checked, setChecked] = useState(true);

    const navigate = useNavigate()

    useEffect(() => {
        if (workFor === 'addBranch') {
            clearState()
        }
    }, [workFor])

    function getDateInFormat(data) {
        let momentData = moment(data)
        return momentData.format('LLL')
    }

    const [selectAll, setSelectAll] = useState(false);
    const [rowData, setRowData] = useState([]);

    const handleHeaderCheckboxClick = () => {
        setSelectAll(!selectAll);
    }

    const handleChildCheckboxClick = (itemId) => {
        const updatedRowsData = rowData.map((row) => {
            if (row.id == itemId) {
                return {
                    ...row,
                    checkbox: !row.checkbox,
                };
            }
            return row;
        });
        setRowData(updatedRowsData);
    }


    const label = { inputProps: { "aria-label": "Checkbox demo" } };


    const columns = [
        {
            field: "rowNumber",
            headerName: (
                <Checkbox
                    {...label}
                    checked={selectAll}
                    onClick={handleHeaderCheckboxClick}
                />
            ),
            minWidth: 90,
            renderCell: (params) => (
                <Checkbox
                    {...label}
                    checked={params.row.checkbox}
                    onClick={() => handleChildCheckboxClick(params.row.id)}
                />
            ),
        },
        {
            field: 'name',
            headerAlign: 'left',
            align: 'left',
            headerName: translations[currentLanguage].name,
            minWidth: 200,
            flex: 1,

        },
        {
            field: 'email_id',
            headerAlign: 'left',
            align: 'left',
            headerName: translations[currentLanguage].emailid,
            minWidth: 250,
            flex: 1,

        },
        {
            field: 'is_active',
            headerName: translations[currentLanguage].active,
            headerAlign: 'left',
            align: 'left',
            type: 'number',
            minWidth: 80,
            flex: 1,
            renderCell: (params) => (
                params.row.is_active ? <CheckIcon /> : <ClearIcon />
            ),

        },
        {
            field: 'address', headerName: translations[currentLanguage].address, minWidth: 250, flex: 1,
            valueGetter: (params) => {
                return `${params.row.address ? params.row.address : '-'}`
            }
        },
        {
            field: 'create_date',
            headerName: translations[currentLanguage].createdon,
            // description: 'This column has a value getter and is not sortable.',
            // sortable: false,
            minWidth: 200,
            flex: 1,
            valueGetter: (params) =>
                //     let tempDate = params.row.create_date

                // // return  `${moment().format('LLL')}`,
                getDateInFormat(params.row.create_date)
            // return  'sdcs',
        },
        {
            field: 'code',
            headerName: translations[currentLanguage].code,
            headerAlign: 'center',
            align: 'center',
            type: 'number',
            minWidth: 80,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.code ? params.row.code : '-'}`
            }

        },
        {
            field: "menu",
            headerName: <FontAwesomeIcon icon={faEllipsisV} />,
            className: "bg-dark",
            sortable: false,
            filterable: false,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
            maxWidth: 150,
            // flex: 1,
            position: "sticky",
            renderCell: (params) => (
                <div className="d-flex justify-content-center dotHover">
                    <FontAwesomeIcon icon={faEllipsisV} />
                    <div className="expandDiv">
                        <Tooltip title={translations[currentLanguage].edit}>
                            <button onClick={() => { editActionCall(params.row) }} className='myActionBtn m-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                            </button>
                        </Tooltip>
                        <Tooltip title={translations[currentLanguage].delete}>
                            <button
                                onClick={() => {
                                    deleteActionCall(params.row);
                                }}
                                className="myActionBtn m-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                </div>
            ),
        },
    ];

    async function getBranchList() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/branch/get-branch-data`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data && response.data.isSuccess) {
                setBranchsList(response.data.result)
            }
        })

    }
    useEffect(() => {
        getBranchList()
    }, [])
    async function getStateList() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-state-list`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data.isSuccess) {
                setStateList(response.data.result)
            }
        })

    }
    async function getTalukaByDistrict(id) {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-taluka-list/${id}`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data.isSuccess) {
                setTalukaList(response.data.result)
            }
        })
    }
    async function getDistrictByState(id) {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-district-list/${id}`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data.isSuccess) {
                setDistrictList(response.data.result)
            }
        })
    }
    async function getVillageByTaluka(id) {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-village-list/${id}`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data.isSuccess) {
                setVillageList(response.data.result)

                // setBranchsList(response.data.result)
            }
        })
    }
    useEffect(() => {
        if (workFor !== 'branch') {
            getStateList()
        }
    }, [workFor])

    function selectBranch(e, data) {
        const inpCheckBox = document.getElementsByClassName('inpCheckBox')
        Array.from(inpCheckBox).forEach(i => {
            i.checked = false
        })
        e.currentTarget.firstChild.firstChild.checked = true
    }
    function editActionCall(data) {
        console.log(data.id, 'edit id')
        console.log('data ********', data)
        navigate('/administration/configuration/branch/edit')
        setBranchData({
            id: data.id,
            address: data.address,
            code: data.code,
            contactPerson: data.contact_person,
            description: data.description,
            email: data.email_id,
            firmName: data.name,
            gstNumber: data.gst_number,
            mobileNumber: data.mobile_number,
            state: data.state,
            district: data.district,
            taluka: data.taluka,
            village: data.village,
        })
    }

    function clearState() {
        setBranchData({
            address: "",
            code: "",
            contactPerson: "",
            description: "",
            email: "",
            firmName: "",
            gstNumber: "",
            mobileNumber: "",
            state: "",
            district: "",
            taluka: "",
            village: "",
        })
        setStateList([])
        setDistrictList([])
        setTalukaList([])
        setVillageList([])
        const inpClr = document.getElementsByClassName('inpClr')
        Array.from(inpClr).forEach(i => {
            if (i.type === 'select-one') {
                i.value = 0
            } else if (i.type === 'text') {
                i.value = ''
            } else {
                i.value = ''

            }
        })

    }

    const deleteActionCall = (data) => {
        console.log(data, "fffffffffffffffffff");
        setType("branch_delete");
        console.log(data.id);
        setBranchDeleteId(data.id);
        setDeleteMessage(`Are You Sure You Want To Delete The branch '${data.name}'?`);
        setDisplayConfirmationModal(true);
    };

    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    const submitDelete = async () => {
        if (branchDeleteId) {
            const url = `${process.env.REACT_APP_NODE_URL}/api/branch/delete-branch/${branchDeleteId}`;
            const config = {
                headers: {
                    token: localStorage.getItem("rbacToken"),
                },
            };

            try {
                const response = await Axios.get(url, config);
                console.log(response, "response.data");
                if (response.data && response.data.isSuccess) {
                    console.log(response.data, "delete true");
                    dispatch(setShowMessage("Branch Deleted"));
                    getBranchList();
                    setDisplayConfirmationModal(false);
                } else {
                    console.log(response.data, "false");
                    dispatch(setShowMessage("Failed to delete"));
                }
            } catch (error) {
                console.error("Error while deleting branch:", error);
            }
        }
    };
    async function saveToDb(data) {
        const url = `${process.env.REACT_APP_NODE_URL}/api/branch/add-new-branch`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };

        await axios.post(url, data, config).then((response) => {
            if (response.data) {
                if (response.data.isSuccess) {
                    if (response.data.result === 'success') {
                        dispatch(setShowMessage('New branch is created'))
                        clearState()
                        navigate('/administration/configuration/branch')
                        getBranchList()
                    } else {
                        dispatch(setShowMessage('Something is wrong'))
                    }
                }
            }

        })
    }
    async function editToDb(data) {
        const url = `${process.env.REACT_APP_NODE_URL}/api/branch/edit-branch-details`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };

        await axios.post(url, data, config).then((response) => {
            if (response.data) {
                if (response.data.isSuccess) {
                    if (response.data.result === 'success') {
                        dispatch(setShowMessage('Branch is updated'))
                        clearState()
                        navigate('/administration/configuration/branch')
                        getBranchList()
                    } else {
                        dispatch(setShowMessage('Something is wrong'))
                    }
                }
            }

        })
    }
    async function saveTheNewBranch(data) {
        if (
            branchData.address.length > 0 &&
            branchData.code.length > 0 &&
            branchData.contactPerson.length > 0 &&
            branchData.description.length > 0 &&
            branchData.email.length > 0 &&
            branchData.firmName.length > 0 &&
            branchData.gstNumber.length > 0 &&
            branchData.mobileNumber.length > 0
        ) {
            if (workFor == 'addBranch') {
                saveToDb(data)

            } else {
                console.log('data', data)
                editToDb(data)
            }

        } else {
            dispatch(setShowMessage('Please fill all the marked field'))
        }
    }

    useEffect(() => {
        const rowsData = branchList.map((item, index) => ({
            ...item,
            rowNumber: item.id,
            checkbox: selectAll,
        }));
        setRowData(rowsData);
    }, [branchList, selectAll]);

    function changeHandler(e) {
        const name = e.target.name
        const value = e.target.value

        switch (name) {
            case 'state':
                getDistrictByState(value)
                break;
            case 'district':
                getTalukaByDistrict(value)
                break;
            case 'taluka':
                getVillageByTaluka(value)
                break;
        }
        setBranchData((branchData) => ({ ...branchData, [name]: value }))

    }
    function saveBtnCalled() {
        console.log('branchData', branchData)
        console.log('branchList', branchList)
        saveTheNewBranch(branchData)
    }
    function cancelHandler() {
        navigate('/administration/configuration/branch')

    }

    const onSelectedState = (val) => {
        setBranchData((pre) => {
            return { ...pre, state: val };
        })
    }
    const onSelectedDistrict = (val) => {
        setBranchData((pre) => {
            return { ...pre, district: val }
        })
    }
    const onSelectedTaluka = (val) => {
        setBranchData((pre) => {
            return { ...pre, taluka: val }
        })
    }
    const onSelectedVillage = (val) => {
        setBranchData((pre) => {
            return { ...pre, village: val }
        })
    }
    const redirectModal = () => {
        navigate(-1);
    };
    return (
        <div className='bg-white rounded p-3'>
            <main>
                {workFor !== 'branch' && (
                    <div className="col-6">
                        <h5 className='m-0'>
                            {workFor === 'addBranch'
                                ? translations[currentLanguage].newbranch
                                : translations[currentLanguage].editbranch}
                        </h5>
                    </div>
                )}

                <div className='row m-0'>
                    {
                        workFor === 'branch' && <div className='mb-3  d-flex align-items-end justify-content-end'>
                            <div onClick={() => { navigate('/administration/configuration/branch/add') }} className='d-flex align-items-center' type='button'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>
                                <h6 className='m-0 ps-1'>
                                    {translations[currentLanguage].newbranch}
                                </h6>
                                <Button
                                    variant="btn btn-warning mx-1"
                                    style={{
                                        width: '70px',
                                        height: '35px',
                                        fontSize: '14px',
                                        borderRadius: '20px',
                                    }}
                                    onClick={() => {
                                        redirectModal();
                                    }}
                                >
                                    {translations[currentLanguage].back}
                                </Button>
                            </div>

                        </div>
                    }
                    {
                        workFor === 'branch' && <div className='tableMenuHover' style={{ height: '85vh', width: '100%' }}>

                            <DataGrid
                                rows={rowData}
                                columns={columns}
                                getRowId={(params) => {
                                    return params.rowNumber
                                }}
                                className='rounded'
                                style={{ fontFamily: 'Poppins', padding: 5, backgroundColor: 'white', }}
                                pageSizeOptions={[5, 10, 25]}
                                initialState={{
                                    ...branchList.initialState,
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
                        </div>
                    }
                    {
                        workFor !== 'branch' && <>
                            <div div className=" d-flex align-items-end justify-content-end">
                                <Button
                                    variant="btn btn-warning mx-1"
                                    style={{
                                        width: '70px',
                                        height: '35px',
                                        fontSize: '14px',
                                        borderRadius: '20px',
                                    }}
                                    onClick={() => {
                                        redirectModal();
                                    }}
                                >
                                    {translations[currentLanguage].back}
                                </Button>
                            </div>
                            <div className='row mt-2 m-0'>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email">{translations[currentLanguage].branchname} * </label>
                                    <input defaultValue={branchData.firmName} onChange={changeHandler} className='inpClr myInput inputElement' autoComplete='false' type="text" name="firmName" />
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email"> {translations[currentLanguage].gstno} *</label>
                                    <input defaultValue={branchData.gstNumber} onChange={changeHandler} className='inpClr myInput inputElement' autoComplete='false' type="text" name="gstNumber" />
                                </section>
                                <State onSelectedState={onSelectedState}
                                    stateId={branchData.state} />
                                <District onSelectedDistrict={onSelectedDistrict}
                                    stateId={branchData.state}
                                    districtId={branchData.district} />
                                <Taluka onSelectedTaluka={onSelectedTaluka}
                                    districtId={branchData.district}
                                    talukaId={branchData.taluka} />
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email"> {translations[currentLanguage].contactperson}</label>
                                    <input defaultValue={branchData.contactPerson} onChange={changeHandler} className='inpClr myInput inputElement' autoComplete='false' type="text" name="contactPerson" />
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email"> {translations[currentLanguage].mobileno} *</label>
                                    <input maxLength={15} defaultValue={branchData.mobileNumber} onChange={changeHandler} className='inpClr myInput inputElement' autoComplete='false' type="text" name="mobileNumber" />
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email"> {translations[currentLanguage].email} *</label>
                                    <input defaultValue={branchData.email} onChange={changeHandler} className='inpClr myInput inputElement' autoComplete='false' type="text" name="email" />
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email"> {translations[currentLanguage].code} *</label>
                                    <input defaultValue={branchData.code} onChange={changeHandler} className='inpClr myInput inputElement' autoComplete='false' type="text" name="code" />
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email">{translations[currentLanguage].branchaddress} *</label>
                                    <textarea defaultValue={branchData.address} onChange={changeHandler} className='inpClr myInput inputElement' rows='3' autoComplete='false' type="text" name="address" />
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email"> {translations[currentLanguage].description}</label>
                                    <textarea defaultValue={branchData.description} onChange={changeHandler} className='inpClr myInput inputElement' rows='3' autoComplete='false' type="text" name="description" />
                                </section>
                                <section className='d-flex pt-3 flex-column flex-sm-row'>
                                    <button className='col-12 col-sm-3 col-lg-2 myBtn py-2' onClick={saveBtnCalled} type='button'> {translations[currentLanguage].save}</button>
                                    <button className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-3 col-lg-2 myBtn py-2' onClick={cancelHandler} type='button'> {translations[currentLanguage].cancel}</button>
                                </section>

                            </div>
                        </>
                    }
                </div>
                <AlertDeleteModal
                    showModal={displayConfirmationModal}
                    confirmModal={submitDelete}
                    hideModal={hideConfirmationModal}
                    type={type}
                    id={branchDeleteId}
                    message={deleteMessage}
                />
            </main >
        </div >
    )
}
