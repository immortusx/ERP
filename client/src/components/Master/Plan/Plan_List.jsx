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
import AlertDeleteModal from '../../AlertDelete/AlertDeleteModal';
import { Switch } from '@mui/material';
const Plan_List = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const [checked, setChecked] = useState(false);

    const handleShow = () => {
        setModalShow(true);
    }
    const handleClose = () => {
        setModalShow(false);
    }
    const editeStateModal = (data) => {
        setModalShow(true);
        console.log(data, 'evdata')
    }
    const handleChange = (event) => {
        const { checked } = event.target;
        setChecked(checked);
        console.log(checked);
      };

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
            field: 'partName',
            headerAlign: 'center',
            align: 'center',
            headerName: 'Part Name',
            minWidth: 100,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.partName ? params.row.partName : '-'}`
            }
        },
        {
            field: 'partNumber',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Part Number',
            minWidth: 150,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.partNumber ? params.row.partNumber : '-'}`
            }
        },
        {
            field: 'partDescription',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Part Description',
            minWidth: 150,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.partDescription ? params.row.partDescription : '-'}`
            }
        },
        {
            field: 'hsn',
            headerAlign: 'left',
            align: 'left',
            headerName: 'HSN',
            minWidth: 150,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.hsn ? params.row.hsn : '-'}`
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
                    <button className='myActionBtn m-1'
                        onClick={() => { editeStateModal(params.row) }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </button>
                    <button className='myActionBtn m-1'
                    // onClick={() => { deleteStateAlert(params.row) }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                        </svg>
                    </button>
                </div>
            ),
        }
    ];

    const vehicleData = [
        {
            id: 1,
            partName: 'Brake Pad',
            partNumber: 'BP001',
            partDescription: 'High-quality brake pad for improved braking performance',
            hsn: '870830'
        },
        {
            id: 2,
            partName: 'Spark Plug',
            partNumber: 'SP002',
            partDescription: 'Premium spark plug for efficient combustion',
            hsn: '851110'
        },
        {
            id: 3,
            partName: 'Air Filter',
            partNumber: 'AF003',
            partDescription: 'Durable air filter for clean airflow',
            hsn: '842139'
        },
        {
            id: 4,
            partName: 'Oil Filter',
            partNumber: 'OF004',
            partDescription: 'Effective oil filter for engine protection',
            hsn: '842123'
        },
        {
            id: 5,
            partName: 'Alternator',
            partNumber: 'AL005',
            partDescription: 'Reliable alternator for electrical power generation',
            hsn: '851150'
        }
    ];




    return (
        <>
            <div className=''>
                {/* <NavLink to={/edit-user}>callme</NavLink > */}
                <div className='my-3  d-flex align-items-end justify-content-end'>
                    <div className='d-flex align-items-center' type='button'>

                        <h6 className='m-0 ps-1'>
                            <button type="button" className="btn btn-primary"
                                onClick={handleShow}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>&nbsp;
                                Add Plan
                            </button>
                        </h6>
                    </div>
                </div>


                <div style={{ height: '85vh', width: '100%' }}>
                    <DataGrid
                        rows={vehicleData}
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
                </div>
            </div>


            <AlertDeleteModal
            // showModal={displayConfirmationModal} 
            // confirmModal={submitDelete}
            //  hideModal={hideConfirmationModal}
            //   type={type} id={id} message={deleteMessage}
            />
            {/* state modal */}
            <Modal
                show={modalShow}
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <h5 className="modal-title" id="districtModalLabel">ADD PLAN</h5>
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        <div className="mb-3">
                            <label htmlFor="recipient-name" className="col-form-label">Part Name:</label>
                            <input type="text" className="form-control" id="recipient-name" name="stateName"
                            // value={stateData.stateName} onChange={(e) => { onChangeHandler(e) }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label">Part Number:</label>
                            <input className="form-control" id="message-text" name="stateDiscription"
                            //  value={stateData.stateDiscription} onChange={(e) => { onChangeHandler(e) }}
                            ></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label">Part Description:</label>
                            <textarea className="form-control" id="message-text" name="stateDiscription"
                            //  value={stateData.stateDiscription} onChange={(e) => { onChangeHandler(e) }}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label">HSN:</label>
                            <input className="form-control" id="message-text" name="stateDiscription"
                            //  value={stateData.stateDiscription} onChange={(e) => { onChangeHandler(e) }}
                            ></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label">Active:</label>
                            <input className="form-control" id="message-text" name="stateDiscription"
                            //  value={stateData.stateDiscription} onChange={(e) => { onChangeHandler(e) }}
                            ></input>
                        </div>
                        <Switch
                            checked={true}
                            defaultValue={checked}
                            onChange={handleChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary"
                        onClick={handleClose}
                    > Close </Button>
                    <Button variant="primary"
                    // onClick={handleSubmit}
                    >  Save  </Button>
                </Modal.Footer>
            </Modal>
            {/* state modal end*/}
        </>
    )
}

export default Plan_List
