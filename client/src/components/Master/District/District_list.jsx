import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Checkbox from '@mui/material/Checkbox'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { addDistrictToDb, clearaddDistrict } from '../../../redux/slices/Master/District/addDistrictSlice'
import { setShowMessage } from '../../../redux/slices/notificationSlice'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
//import {getAllDistrictAction, editeDistrictAction} from './getEditDistrict'
import { getAllDistrictAction, getDistrictById, editeDistrictAction, deleteDistrictAction } from './getEditDistrict'
import { getAllStateAction, editeStateAction } from '../State/getEditeSate'
import AlertDeleteModal from '../../AlertDelete/AlertDeleteModal';

const axios = require('axios');

export default function District_list() {
    const location = useLocation();
    const modalStatus = location.state;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [stateOptions, setStatateOptions] = useState([])
    //const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [allDistrictDate, setAllDistrictDate] = useState([]);
    const [editDistrictById, setEditDistrictById] = useState('');
    const addDistrict = useSelector(state => state.addDistrictSlice.addDistrict);

    //---- Delete Modal Variable -----//
    const [type, setType] = useState(null);
    const [id, setId] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);


    const [districtData, setDistrictData] = useState({
        DistrictName: '',
        StateName: ''
    })
    const handleClose = () => {
        if (modalStatus === true) {
            goBack()
        } else {
            setModalShow(false);
        }
    }
    const handleShow = () => {
        if (modalStatus === true) {
            goBack()
        } {
            setModalShow(true);
        }
    }

    const goBack = () => {
        if (modalStatus === true) {
            navigate(-1);
        }
    }
    useEffect(() => {
        getAllStateAction().then((data) => {
            console.log('Response from getAllStateAction:', data.result);
            setStatateOptions(data.result)
        }).catch((error) => {
            console.error('Error in getAllStateAction:', error);
        });
        getAllDistrictAction().then((data) => {
            setAllDistrictDate(data.result)
        }).catch((error) => {
            console.error('Error in getAllDistrictAction:', error);
        });



    }, [])
    useEffect(() => {
        if (addDistrict.isSuccess) {
            if (addDistrict.message.result === 'success') {
                dispatch(setShowMessage('District is Added'))
                goBack();
                clearInpHook()
                dispatch(clearaddDistrict())
                setModalShow(false);
                getAllDistrictAction().then((data) => {
                    console.log('Response from getAllDistrictAction:', data.result);
                    setAllDistrictDate(data.result)
                })
            } else if (addDistrict.message.result === 'alreadyExist') {
                dispatch(setShowMessage('District is already Exists!'))
                dispatch(clearaddDistrict())
            } else {
                dispatch(setShowMessage('Something is wrong!'))
            }
        }
    }, [addDistrict])


    function clearInpHook() {
        setDistrictData({
            DistrictName: '',
            StateName: ''
        })
        setEditDistrictById('');
    }


    // const getState = async () => {
    //     axios.get(`${process.env.REACT_APP_NODE_URL}/api/master/get-allsate`)
    //         .then(response => {
    //             console.log(response.data);
    //             setStatateOptions(response.result)
    //         })
    //         .catch(error => {

    //             console.error(error);
    //         });
    // }

    function onChangeHandler(e) {
        const name = e.target.name;
        const value = e.target.value;
        setDistrictData({ ...districtData, [name]: value })
    }

    function handleSubmit() {
        console.log('districtData', districtData)

        const dName = districtData.DistrictName;
        const dsName = districtData.StateName;

        if (dName.length > 0 && dsName !== '') {
            // userData['dealerRole'] = dealerRoles
            // if (workFor === 'forEdit') {
            //     userData['id'] = editUserData.id
            //     dispatch(editUserUpdateToDb(userData))
            // } else {
            if (editDistrictById != '') {
                console.log('Update getDistrictActionIdData: ', editDistrictById);
                districtData['id'] = editDistrictById;
                // console.log('UpdatedistrictData', districtData)
                editeDistrictAction(districtData).then((data) => {
                    console.log('state Update getDistrictActionIdData:', data);
                    if (data.result === "updatesuccess") {
                        getAllDistrictAction().then((data) => { setAllDistrictDate(data.result) });
                        setModalShow(false);
                        clearInpHook();
                        dispatch(setShowMessage('State Data Update Successfully!'));
                    } else {
                        dispatch(setShowMessage('Something is wrong!'))
                    }
                }).catch((error) => {
                    console.error('Error in getAllDistrictAction:', error);
                });
            } else {
                dispatch(addDistrictToDb(districtData))
            }
        } else {
            dispatch(setShowMessage('All Field Must be Required.'))
        }

    }

    function handleCancel() {
        console.log('districtDatahandleCancel', districtData)
        setDistrictData({ DistrictName: '', StateName: '' })
    }
    const editeDistrictModal = (ev) => {
        getDistrictById(ev.id).then((data) => {
            console.log('Response from getDistrictActionIdData:', data);

            setDistrictData({
                DistrictName: data[0].name,
                StateName: data[0].state_id
            })
            setEditDistrictById(data[0].id)
            setModalShow(true);
        }).catch((error) => {
            console.error('Error in getAllDistrictAction:', error);
        });

    }
    const deleteDistrictAlert = (ev) => {
        setType('district_delete');
        setId(ev.id);
        setDeleteMessage(`Are You Sure You Want To Delete The District '${ev.name}'?`);
        setDisplayConfirmationModal(true);
    }

    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };
    const submitDelete = (type, id) => {
        console.log(type, 'DistrictDeleteId: ', id)
        districtData['id'] = id;
        deleteDistrictAction(districtData).then((data) => {
            console.log('district Update getDistrictActionIdData:', data);
            if (data.result === "deletesuccess") {
                getAllDistrictAction().then((data) => { setAllDistrictDate(data.result) });
                clearInpHook();
                setDisplayConfirmationModal(false);
                dispatch(setShowMessage('District Data Delete Successfully!'));
            } else {
                dispatch(setShowMessage('Something is wrong!'))
            }
        }).catch((error) => {
            console.error('Error in getAllDistrictAction:', error);
        });
    };

    // const columns = [
    //     {
    //         field: 'rowNumber',
    //         headerAlign: 'center',
    //         align: 'center',
    //         headerName: 'No',
    //         minWidth: 80,
    //         flex: 1,

    //     },

    const[selectAll,setSelectAll]=useState(false);
    const[rowData,setRowData]=useState([]);
    
    const handleHeaderCheckboxClick=()=>{
        setSelectAll(!selectAll);
    }
  
    const handleChildCheckboxClick=(itemId)=>{
        const updatedRowsData=rowData.map((row)=>{
            if(row.id==itemId){
                return{
                    ...row,
                    checkbox:!row.checkbox,
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
            // flex: 1,
            renderCell: (params) => (
              <Checkbox
                {...label}
                checked={params.row.checkbox}
                onClick={() => handleChildCheckboxClick(params.row.id)}
              />
            ),
          },
        {
            field: 'District Name',
            headerAlign: 'center',
            align: 'center',
            headerName: 'District Name',
            minWidth: 100,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.name ? params.row.name : '-'}`
            }
        },
        {
            field: 'State Name',
            headerAlign: 'left',
            align: 'left',
            headerName: 'State Name',
            minWidth: 150,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.state_name ? params.row.state_name : '-'}`
            }
        },
        {
            field: 'is_active',
            headerName: 'Active',
            headerAlign: 'left',
            align: 'left',
            type: 'number',
            minWidth: 80,
            flex: 1,
            renderCell: (params) => (
                params.row.is_active ? <CheckIcon /> : <ClearIcon />
            ),

        },
        // {
        //     field: 'actions',
        //     headerName: 'Actions',
        //     className: 'bg-dark',
        //     sortable: false,
        //     filterable: false,
        //     headerAlign: 'center',
        //     align: 'center',
        //     disableColumnMenu: true,
        //     minWidth: 200,
        //     flex: 1,
        //     position: 'sticky',
        //     renderCell: (params) => (
        //         <div>
        //             {/* <button onClick={() => { editActionCall(params.row) }} className='myActionBtn m-1'> */}
        //             <button className='myActionBtn m-1' onClick={() => { editeDistrictModal(params.row) }}>
        //                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
        //                     <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
        //                     <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
        //                 </svg>
        //             </button>
        //             <button className='myActionBtn m-1' onClick={() => { deleteDistrictAlert(params.row) }}>
        //                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
        //                     <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
        //                 </svg>
        //             </button>
        //         </div>
        //     ),
        // },  
        {
            field: "menu",
            headerName: <FontAwesomeIcon icon={faEllipsisV} />,
            className: "bg-dark",
            sortable: false,
            filterable: false,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
            maxWidth: 50,
            // flex: 1,
            position: "sticky",
            renderCell: (params) => (
              <div className="d-flex justify-content-center dotHover">
                <FontAwesomeIcon icon={faEllipsisV} />
                <div className="expandDiv">
                <button className='myActionBtn m-1' onClick={() => { editeDistrictModal(params.row) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </button>
                    <button className='myActionBtn m-1' onClick={() => { deleteDistrictAlert(params.row) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                        </svg>
                    </button>
                </div>
              </div>
            ),
          },
    ];

    useEffect(() => {
        const rowsData = allDistrictDate.map((item, index) => ({
          ...item,
          rowNumber: index + 1,
          checkbox: selectAll,
        }));
        setRowData(rowsData);
      }, [allDistrictDate, selectAll]);
    // const rowsData = allDistrictDate.map((item, index) => ({ ...item, rowNumber: index + 1 }));


    const deleteDistrictActino = () => {
        //setModalShow(true);
    }
    const openModal = () => {
        if (modalStatus === true) {
            setModalShow(true)
        }
    }
    useEffect(() => {
        openModal();
    }, [])

    return (
        <>
            <div className=''>
                {/* <NavLink to={/edit-user}>callme</NavLink > */}
                <div className='my-3  d-flex align-items-end justify-content-end'>
                    <div className='d-flex align-items-center' type='button'>

                        <h6 className='m-0 ps-1'>
                            {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#districtModal" data-bs-whatever="@mdo">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>&nbsp;
                                Add District
                            </button> */}
                            <button type="button" className="btn btn-primary" onClick={handleShow}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>&nbsp;
                                Add District
                            </button>

                        </h6>
                    </div>
                </div>


                <div className='tableMenuHover' style={{ height: '85vh', width: '100%' }}>
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
                            // ...userListData.initialState,
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
            </div>
            <AlertDeleteModal showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} type={type} id={id} message={deleteMessage} />

            {/* new modal */}
            <Modal show={modalShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <h5 className="modal-title" id="districtModalLabel">ADD District</h5>
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        <div className="mb-3">
                            <label htmlFor="select" className="col-form-label">State Name:</label>
                            <select class="form-control" name="StateName" id="select" value={districtData.StateName} onChange={(e) => { onChangeHandler(e) }}>
                                <option value="">Select State</option>
                                {/* <option value="1">GUJARAT </option>
                                <option value="2">Maharashtra </option>
                                <option value="3">Rajasthan </option> */}
                                {stateOptions.map((option) => (
                                    <option key={option.state_id} value={option.state_id}>
                                        {option.state_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="recipient-name" className="col-form-label">District Name:</label>
                            <input type="text" className="form-control" id="recipient-name" name="DistrictName" value={districtData.DistrictName} onChange={(e) => { onChangeHandler(e) }} />
                        </div>
                        {/* <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label">District Discription:</label>
                            <textarea className="form-control" id="message-text" name="stateName"  value={districtData.stateName} onChange={(e) => { onChangeHandler(e) }}></textarea>
                        </div> */}

                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                </Modal.Footer>

            </Modal>
            {/* new modal end*/}


            {/* Modal District */}
            {/* <div className="modal fade" id="districtModal" tabIndex="-1" aria-labelledby="districtModalLabel" aria-hidden="true">          
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="districtModalLabel">ADD District</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="select" className="col-form-label">State Name:</label>
                                <select class="form-control" name="StateName" id="select" onChange={(e) => { onChangeHandler(e) }}>
                                    <option value="">Select State</option>
                                    <option value="1">GUJARAT </option>
                                    <option value="2">Maharashtra </option>
                                    <option value="3">Rajasthan </option>
                                 
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">District Name:</label>
                                <input type="text" className="form-control" id="recipient-name" name="DistrictName" value={districtData.DistrictName} onChange={(e) => { onChangeHandler(e) }} />
                            </div>
                          

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleSubmit} >Save</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    )
}
