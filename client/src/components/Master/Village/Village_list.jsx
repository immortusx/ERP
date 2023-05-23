import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Checkbox from '@mui/material/Checkbox'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { addStateToDb, clearAddState } from '../../../redux/slices/Master/State/addStateSlice'
import { setShowMessage } from '../../../redux/slices/notificationSlice'
import { Modal, Button } from 'react-bootstrap';
import {getAllStateAction, getStateById, editeStateAction,deleteStateAction} from './getEditeVillage'
// import {getAllDistrictByStateId} from '../District/getEditDistrict'
import AlertDeleteModal from '../../AlertDelete/AlertDeleteModal';

export default function Village_list() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [allStateDate, setAllStateDate] = useState([]);
    const [stateOptions, setStatateOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [editStateById, setEditStateById] = useState('');
    const [modalShow, setModalShow] = React.useState(false);

    //---- Delete Modal Variable -----//
    const [type, setType] = useState(null);
    const [id, setId] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);

    const addState = useSelector(state => state.addStateSlice.addState);
    const { addStateSlice } = useSelector(state => state.addStateSlice)
    const [villageData, setVillageData] = useState({
        state_id:'',       
        district_id:'',        
        taluka_id:'',        
        villageName:''
    })

    function onChangeHandler(e) {
        const name = e.target.name;
        const value = e.target.value;
        switch(name){
            case 'state_id':
                setVillageData({ ...villageData, [name]: value });
                // getAllDistrictByStateId(value).then((data) => {
                //     setDistrictOptions(data.result)
                // }).catch((error) => {
                //     console.error('Error in getAllStateAction:', error);
                // });
                break;
            case 'district_id':
                setVillageData({ ...villageData, [name]: value })
                getAllStateAction().then((data) => {
                    setStatateOptions(data.result)
                }).catch((error) => {
                    console.error('Error in getAllStateAction:', error);
                });
                break;
            case 'taluka_id':
                setVillageData({ ...villageData, [name]: value });                
                break;
            default :
                setVillageData({ ...villageData, [name]: value })
                break;    
               
        }       
        console.log(villageData,'village onchange',name)
        console.log(districtOptions)
    }

    const handleClose = () => {
        setModalShow(false);
        clearInpHook()  
    }
    const handleShow = () => {
        setModalShow(true);
    }
    function handleSubmit() {
       
        const sName = villageData.state_id;
        const sDiscr = villageData.villageName;

        if (sName.length > 0 && sDiscr.length > 0) {
            if (editStateById != '') {
                
                villageData['state_id'] = editStateById;
                
                editeStateAction(villageData).then((data) => {
                    console.log('state Update getStateActionIdData:', data); 
                    if(data.result === "updatesuccess"){
                        getAllStateAction().then((data) => { setAllStateDate(data.result)});
                        setModalShow(false);
                        clearInpHook();
                        dispatch(setShowMessage('State Data Update Successfully!')); 
                    }else {
                        dispatch(setShowMessage('Something is wrong!'))
                    }                
                }).catch((error) => {
                    console.error('Error in updateStateAction:', error);
                });
            } else {
                dispatch(addStateToDb(villageData))
            }
        } else {
            dispatch(setShowMessage('All Field Must be Required.'))
        }
    }

    const editeStateModal=(ev) =>{
        getStateById(ev.state_id).then((data) => {            
            setVillageData({
                state_id: data[0].state_name,
                villageName: data[0].description
            })
            setEditStateById(data[0].state_id)
            setModalShow(true);
        }).catch((error) => {
            console.error('Error in editStateAction:', error);
        });        
    }
    const deleteStateAlert=(ev) =>{
        //setModalShow(true);
        setType('state_delete');
        setId(ev.state_id);
        setDeleteMessage(`Are You Sure You Want To Delete The State '${ev.state_name}'?`);
        setDisplayConfirmationModal(true);
    }

    // Hide the Deletemodal
    // const hideConfirmationModal = () => {
    //     setDisplayConfirmationModal(false);
    // };
    // const submitDelete = (type, id) => { 
    
    //     villageData['state_id'] = id;
    //     deleteStateAction(villageData).then((data) => {
             
    //         if(data.result === "deletesuccess"){
    //             getAllStateAction().then((data) => { setAllStateDate(data.result)});                
    //             clearInpHook();
    //             setDisplayConfirmationModal(false);
    //             dispatch(setShowMessage('State Data Delete Successfully!')); 
    //         }else {
    //             dispatch(setShowMessage('Something is wrong!'))
    //         }                
    //     }).catch((error) => {
    //         console.error('Error in DeleteStateAction:', error);
    //     }); 
    // };

    // useEffect(() => {
    //     if (addState.isSuccess) {
    //         if (addState.message.result === 'success') {
    //             dispatch(setShowMessage('State Save Successfully!')) 
    //             clearInpHook()               
    //             dispatch(clearAddState())              
    //             setModalShow(false);
    //         } else if (addState.message.result === 'alreadyExist') {
    //             dispatch(setShowMessage('Please Enter Other State Name!'))
    //             dispatch(clearAddState())
    //         } else {
    //             dispatch(setShowMessage('Something is wrong!'))
    //         }
    //     }
    // }, [addState])

    function clearInpHook() {
        setVillageData({
            state_id:'',       
            district_id:'',        
            taluka_id:'',        
            villageName:''
        })
        setEditStateById('');
    }

   
   
    const columns = [
        {
            field: 'rowNumber',
            headerAlign: 'center',
            align: 'center',
            headerName: 'No',
            minWidth: 80,
            flex: 1,

        },
        {
            field: 'state_name',
            headerAlign: 'center',
            align: 'center',
            headerName: 'State Name',
            minWidth: 100,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.state_name ? params.row.state_name : '-'}`
            }
        },
        {
            field: 'description',
            headerAlign: 'left',
            align: 'left',
            headerName: 'State Discription',
            minWidth: 150,
            flex: 1,           
            valueGetter: (params) => {
                return `${params.row.description ? params.row.description : '-'}`
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
        {
            field: 'actions',
            headerName: 'Actions',
            className: 'bg-dark',
            sortable: false,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
            disableColumnMenu: true,
            minWidth: 200,
            flex: 1,
            position: 'sticky',
            renderCell: (params) => (
                <div>
                    {/* <button onClick={() => { editActionCall(params.row) }} className='myActionBtn m-1'> */}
                    <button className='myActionBtn m-1' onClick={() => { editeStateModal(params.row) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </button>
                    <button className='myActionBtn m-1' onClick={() => { deleteStateAlert(params.row) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                        </svg>
                    </button>
                </div>
            ),
        }
    ];
    const rowsData = allStateDate.map((item, index) => ({ ...item, rowNumber: index + 1 }));
    
    useEffect(() => {
        getAllStateAction().then((data) => {
            setStatateOptions(data.result)
        }).catch((error) => {
            console.error('Error in getAllStateAction:', error);
        });
       
    }, [])
    return (
        <>
            <div className=''>
                {/* <NavLink to={/edit-user}>callme</NavLink > */}
                <div className='my-3  d-flex align-items-end justify-content-end'>
                    <div className='d-flex align-items-center' type='button'>
                       
                        <h6 className='m-0 ps-1'>                           
                            <button type="button" className="btn btn-primary" onClick={handleShow}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>&nbsp;
                                Add state
                            </button>
                        </h6>
                    </div>
                </div>


                <div style={{ height: '85vh', width: '100%' }}>
                    <DataGrid
                        rows={rowsData}
                        columns={columns}
                        getRowId={(params) => {
                            return params.rowNumber
                        }}
                        className='rounded'
                        style={{ fontFamily: 'Poppins', padding: 5, backgroundColor: 'white', }}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                             ...allStateDate.initialState,
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


            {/* <AlertDeleteModal showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} type={type} id={id} message={deleteMessage}  /> */}
            {/* village modal */}
            <Modal show={modalShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <h5 className="modal-title" id="districtModalLabel">ADD Village</h5>
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        <div className="mb-3">
                            <label htmlFor="selectstate" className="col-form-label">State Name:</label>
                            <select class="form-control" name="state_id" id="selectstate" onChange={(e) => { onChangeHandler(e) }}>
                                <option value="">Select State</option>                                
                                {stateOptions.map((option) => (
                                     <option key={option.state_id} value={option.state_id}>
                                       {option.state_name}
                                     </option>
                                    ))}  
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="selectdistrict" className="col-form-label">District Name:</label>
                            <select class="form-control" name="district_id" id="selectdistrict" onChange={(e) => { onChangeHandler(e) }}>
                                <option value="">Select District</option>                                
                                {/* {districtOptions.map((option) => (
                                     <option key={option.state_id} value={option.state_id}>
                                       {option.state_name}
                                     </option>
                                    ))}   */}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="selecttaluka" className="col-form-label">Taluka Name:</label>
                            <select class="form-control" name="taluka_id" id="selecttaluka" onChange={(e) => { onChangeHandler(e) }}>
                                <option value="">Select Taluka</option>                                
                                {stateOptions.map((option) => (
                                     <option key={option.state_id} value={option.state_id}>
                                       {option.state_name}
                                     </option>
                                    ))}  
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="villagename" className="col-form-label">Village Name:</label>
                            <input type="text" className="form-control" name="villageName"  id="villagename" value={villageData.villageName} onChange={(e) => { onChangeHandler(e) }} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}> Close </Button>
                    <Button variant="primary" onClick={handleSubmit}>  Save  </Button>
                </Modal.Footer>
            </Modal>
            {/* village modal end*/}
        </>
    )
}
