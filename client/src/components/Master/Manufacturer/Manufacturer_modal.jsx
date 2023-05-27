import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Checkbox from '@mui/material/Checkbox'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link, NavLink, useNavigate, useLocation  } from 'react-router-dom';

import { addManufacturerToDb, clearAddManufacturer } from '../../../redux/slices/Master/Manufacturer/addManufacturerSlice'
import { setShowMessage } from '../../../redux/slices/notificationSlice'
import { Modal, Button } from 'react-bootstrap';
import {getAllManufacturerAction, getManufacturerById, editeManufacturerAction,deleteManufacturerAction} from './getEditeManufacturer'
import AlertDeleteModal from '../../AlertDelete/AlertDeleteModal';

export default function Manufacturer_modal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const rowData = location.state?.rowData;
    const [allMfacturerData, setAllMfacturerData] = useState([]);
    const [editMaFacturerById, setEditMaFacturerById] = useState('');
    const [modalShow, setModalShow] = React.useState(false);

    //---- Delete Modal Variable -----//
    const [type, setType] = useState(null);
    const [id, setId] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);

    console.log(rowData,'rowDatarowDatarowDatarowDatarowDatarowDatarowDatarowData')
    
    return (
        <>
            <div className=''>
                {/* <NavLink to={/edit-user}>callme</NavLink > */}
                <div className='my-3  d-flex align-items-end justify-content-end'>
                    <div className='d-flex align-items-center' type='button'>
                       
                        <h6 className='m-0 ps-1'>                           
                            <button type="button" className="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>&nbsp;
                                Add Manufacturer
                            </button>
                        </h6>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className='d-flex'>
                            <label for="exampleFormControlInput1" class="form-label">ManuFacturer Name : </label>
                            <p className='px-4'>{rowData.manufacturerName}</p>
                        </div>
                    </div>
                    <div class="card-body">
                        <div className="row">
                            <div className="col-4"></div>
                            <div className="col-4"></div>
                            <div className="col-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}