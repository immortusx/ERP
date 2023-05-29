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
import axios from 'axios'
const Tax = () => {

    const handleSelectedPr = (event)=> {
        console.log(event.target.value);
    }
    return (
        <>
            <main className='bg-white p-3 rounded'>
                <div className="row">
                    <div className="col-md-5">
                        <div className="form-group">
                            <label for="taxInput">Tax %:</label>
                            <select onChange={handleSelectedPr} className="form-control" id="taxInput">
                                <option value="0">None</option>
                                <option value="18">GST</option>
                                <option value="12">IGST</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="form-group">
                            <label for="percentageInput">Percentage:</label>
                            <input type="text" className="form-control" id="percentageInput" />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-primary mt-4">Add</button>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Tax
