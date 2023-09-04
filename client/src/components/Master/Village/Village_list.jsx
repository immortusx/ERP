import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Checkbox from '@mui/material/Checkbox'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { addVillageToDb, clearaddVillage } from '../../../redux/slices/Master/Village/addVillageSlice'
import { setShowMessage } from '../../../redux/slices/notificationSlice'
import { Modal, Button } from 'react-bootstrap';
import { getAllVillageAction, editeVillageAction, getVillageById, deleteVillageAction } from './getEditeVillage'
import { getAllStateAction, getStateById, } from '../State/getEditeSate'
import { getDistrictByStateId } from '../District/getEditDistrict'
import { getTalukaByDistrictId } from '../Taluka/getEditTaluka'
import AlertDeleteModal from '../../AlertDelete/AlertDeleteModal';

export default function Village_list() {
    const location = useLocation();
    const modalStatus = location.state;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [allStateDate, setAllStateDate] = useState([]);
    const [stateOptions, setStatateOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [talukaOptions, setTalukaOptions] = useState([]);
    const [editVillageById, seteditVillageById] = useState('');
    const [modalShow, setModalShow] = React.useState(false);
    const [allVillageDate, setAllVillageDate] = useState([]);
    //---- Delete Modal Variable -----//
    const [type, setType] = useState(null);
    const [id, setId] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);

    const addVillage = useSelector(state => state.addVillageSlice.addVillage);
    const [villageData, setVillageData] = useState({
        StateName: '',
        DistrictName: '',
        TalukaName: '',
        villageName: ''
    })
    const redirectModal = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (addVillage.isSuccess) {
            if (addVillage.message.result === 'success') {
                dispatch(setShowMessage('Village is Added'))
                goBack();
                clearInpHook()
                dispatch(clearaddVillage())
                setModalShow(false);
                getAllVillageAction().then((data) => {
                    console.log('Response from getAllVillageAction:', data.result);
                    setAllVillageDate(data.result)
                })
            } else if (addVillage.message.result === 'alreadyExist') {
                dispatch(setShowMessage('Taluka is already Exists!'))
                dispatch(clearaddVillage())
            } else {
                dispatch(setShowMessage('Something is wrong!'))
            }
        }
    }, [addVillage])

    function onChangeHandler(e) {
        const name = e.target.name;
        const value = e.target.value;
        switch (name) {
            case 'StateName':
                setVillageData({ ...villageData, [name]: value });
                getDistrictByStateId(value).then((data) => {
                    setDistrictOptions(data.result)
                }).catch((error) => {
                    console.error('Error in getAllDistrictAction:', error);
                });
                break;
            case 'DistrictName':
                setVillageData({ ...villageData, [name]: value })
                getTalukaByDistrictId(value).then((data) => {
                    setTalukaOptions(data.result)
                }).catch((error) => {
                    console.error('Error in getAllVillageAction:', error);
                });
                break;
            case 'TalukaName':
                setVillageData({ ...villageData, [name]: value });
                break;
            default:
                setVillageData({ ...villageData, [name]: value })
                break;

        }
        console.log(villageData, 'village onchange', name)
        // console.log(districtOptions)
    }

    const handleClose = () => {
        if (modalStatus === true) {
            goBack();
        } else {
            setModalShow(false);
            clearInpHook()
        }
    }
    const handleShow = () => {
        if (modalStatus === true) {
            goBack();
        } else {
            setModalShow(true);
        }
    }
    const goBack = () => {
        if (modalStatus === true) {
            navigate(-1);
        }
    }
    function handleSubmit() {
        console.log(villageData, "villageDatavillageDatavillageData")
        const vName = villageData.villageName;
        const vDiscr = villageData.DistrictName;
        const vTaluka = villageData.TalukaName;
        const vstate = villageData.StateName;

        if (vName.length > 0 && vDiscr !== '', vTaluka !== '', vstate !== '') {
            if (editVillageById != '') {

                villageData['id'] = editVillageById;

                editeVillageAction(villageData).then((data) => {
                    console.log('village Update getvillageActionIdData:', data);
                    if (data.result === "updatesuccess") {
                        getAllVillageAction().then((data) => { setAllVillageDate(data.result) });
                        setModalShow(false);
                        clearInpHook();
                        dispatch(setShowMessage('village Data Update Successfully!'));
                    } else {
                        dispatch(setShowMessage('Something is wrong!'))
                    }
                }).catch((error) => {
                    console.error('Error in updateVillageAction:', error);
                });
            } else {
                dispatch(addVillageToDb(villageData))
            }
        } else {
            dispatch(setShowMessage('All Field Must be Required.'))
        }
    }

    const editeVillageModal = (ev) => {
        getVillageById(ev.id).then((data) => {
            console.log(data, "data in vilage edit!!!!!!!!!!!!!!!!!")
            setVillageData({
                villageName: data[0].name,
                TalukaName: data[0].taluka_id,
                StateName: data[0].state_id,
                DistrictName: data[0].district_id
            })
            getDistrictByStateId(data[0].state_id).then((data) => {
                // console.log(data,"getDistrictByStateIdgetDistrictByStateIdgetDistrictByStateId")
                setDistrictOptions(data.result)
            }).catch((error) => {
                console.error('Error in setDistrictOptions:', error);
            });
            getTalukaByDistrictId(data[0].district_id).then((data) => {
                // console.log(data,"getDistrictByStateIdgetDistrictByStateIdgetDistrictByStateId")
                setTalukaOptions(data.result)
            }).catch((error) => {
                console.error('Error in setTalukaOptions:', error);
            });
            seteditVillageById(data[0].id)
            setModalShow(true);
        }).catch((error) => {
            console.error('Error in editStateAction:', error);
        });
    }
    const submitDelete = (type, id) => {
        console.log(type, 'villageDeleteid: ', id)
        villageData['id'] = id;
        deleteVillageAction(villageData).then((data) => {
            //console.log('Taluka Update getTalukaActionIdData:', data); 
            if (data.result === "deletesuccess") {
                getAllVillageAction().then((data) => { setAllVillageDate(data.result) });
                clearInpHook();
                setDisplayConfirmationModal(false);
                dispatch(setShowMessage('Village Data Delete Successfully!'));
            } else {
                dispatch(setShowMessage('Something is wrong!'))
            }
        }).catch((error) => {
            console.error('Error in getAllVillageAction:', error);
        });
    };
    const deleteVillageAlert = (ev) => {
        //setModalShow(true);
        setType('village_delete');
        setId(ev.id);
        setDeleteMessage(`Are You Sure You Want To Delete The Village '${ev.name}'?`);
        setDisplayConfirmationModal(true);
    }



    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };
    function clearInpHook() {
        setVillageData({
            StateName: '',
            DistrictName: '',
            TalukaName: '',
            villageName: ''
        })
        seteditVillageById('');
    }



    // const columns = [
    //     {
    //         field: 'rowNumber',
    //         headerAlign: 'center',
    //         align: 'center',
    //         headerName: 'No',
    //         minWidth: 80,
    //         flex: 1,

    //     },

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
            field: 'Village Name',
            headerAlign: 'center',
            align: 'center',
            headerName: 'Village Name',
            minWidth: 100,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.name ? params.row.name : '-'}`
            }
        },
        {
            field: 'Taluka Name',
            headerAlign: 'center',
            align: 'center',
            headerName: 'Taluka Name',
            minWidth: 100,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.name ? params.row.TalukaName : '-'}`
            }
        },
        {
            field: 'District Name',
            headerAlign: 'left',
            align: 'left',
            headerName: 'District Name',
            minWidth: 150,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.DistrictName ? params.row.DistrictName : '-'}`
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
                return `${params.row.stateName ? params.row.stateName : '-'}`
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
        //             <button className='myActionBtn m-1' onClick={() => { editeVillageModal(params.row) }}>
        //                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
        //                     <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
        //                     <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
        //                 </svg>
        //             </button>
        //             <button className='myActionBtn m-1' onClick={() => { deleteVillageAlert(params.row) }}>
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
                        <button className='myActionBtn m-1' onClick={() => { editeVillageModal(params.row) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                            </svg>
                        </button>
                        <button className='myActionBtn m-1' onClick={() => { deleteVillageAlert(params.row) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                            </svg>
                        </button>                </div>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const rowsData = allVillageDate.map((item, index) => ({
            ...item,
            rowNumber: index + 1,
            checkbox: selectAll,
        }));
        setRowData(rowsData);
    }, [allVillageDate, selectAll]);
    // const rowsData = allVillageDate.map((item, index) => ({ ...item, rowNumber: index + 1 }));

    useEffect(() => {
        getAllStateAction().then((data) => {
            setStatateOptions(data.result)
        }).catch((error) => {
            console.error('Error in getAllStateAction:', error);
        });

        getAllVillageAction().then((data) => {
            console.log(data.result, "All villageeeee")
            const updatedVillage = data.result.filter((item) => item.id !== 1);
            setAllVillageDate(updatedVillage)
        }).catch((error) => {
            console.error('Error in getAllVillageAction:', error);
        });
    }, [])

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
                            <button type="button" className="btn btn-primary" onClick={handleShow}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>&nbsp;
                                Add Village
                            </button>
                        </h6>
                        <Button
                            variant="btn btn-warning mx-1"
                            style={{ width: '75px', height: '40px', fontSize: '14px', borderRadius: '20px' }}
                            onClick={() => {
                                redirectModal();
                            }}
                        >
                            BACK
                        </Button>
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


            <AlertDeleteModal showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} type={type} id={id} message={deleteMessage} />
            {/* village modal */}
            <Modal show={modalShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <h5 className="modal-title" id="districtModalLabel">ADD Village</h5>
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        <div className="mb-3">
                            <label htmlFor="selectstate" className="col-form-label">State Name:</label>
                            <select class="form-control" name="StateName" id="selectstate" value={villageData.StateName} onChange={(e) => { onChangeHandler(e) }}>
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
                            <select class="form-control" name="DistrictName" id="selectdistrict" value={villageData.DistrictName} onChange={(e) => { onChangeHandler(e) }}>
                                <option value="">Select District</option>
                                {districtOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="selecttaluka" className="col-form-label">Taluka Name:</label>
                            <select class="form-control" name="TalukaName" id="selecttaluka" value={villageData.TalukaName} onChange={(e) => { onChangeHandler(e) }}>
                                <option value="">Select Taluka</option>
                                {talukaOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="villagename" className="col-form-label">Village Name:</label>
                            <input type="text" className="form-control" name="villageName" id="villagename" value={villageData.villageName} onChange={(e) => { onChangeHandler(e) }} />
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
