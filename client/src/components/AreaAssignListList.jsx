
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserListFromDb, clearUserListState } from '../redux/slices/getUserListSlice'
import { setEditUserData } from '../redux/slices/editUserDataSlice'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from 'axios'
import moment from 'moment'
import { Modal, Button } from 'react-bootstrap';
import '../styles/Users.css'
import { Link, NavLink, useNavigate } from 'react-router-dom';
export default function AreaAssignListList() {
    const [areaAssign, setareaAssign] = useState([]);
    const navigate = useNavigate()
    const columns = [
        {
            field: 'rowNumber',
            headerAlign: 'center',
            align: 'center',
            headerName: 'No',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'first_name',
            headerAlign: 'left',
            align: 'left',
            headerName: 'First Name',
            minWidth: 150,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.first_name ? params.row.first_name : '-'}`
            }
        },
        {
            field: 'last_name', headerName: 'Last Name', minWidth: 150, flex: 1,
            valueGetter: (params) => {
                return `${params.row.last_name ? params.row.last_name : '-'}`
            }
        },
        { field: 'phone_number', headerName: 'Phone Number', minWidth: 150, flex: 1, },


        {
            field: 'area_assign',
            headerName: 'area_assign',
            headerAlign: 'left',
            align: 'left',
            type: 'number',
            minWidth: 150,
            flex: 1,
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
                    <button onClick={() => { console.log(params) }} className='myActionBtn m-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </button>
                    <button className='myActionBtn m-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                        </svg>
                    </button>
                    <button  onClick={() => { navigate('/sale/areaAssign/addAsignArea',{ state: {id:params.row.id, firstName: params.row.first_name, lastName: params.row.last_name, phoneNumber: params.row.phone_number } }) }} className='myActionBtn m-1'>
                        assign
                    </button>
                </div>
            ),
        }
    ];
    async function getAreaAssignUserFromDb() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/get-areaAssignUser`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await Axios.get(url, config).then((response) => {
            if (response.data?.isSuccess) {

                setareaAssign(response.data.result)
            }
        })
    }
    useEffect(() => {
        getAreaAssignUserFromDb()
    }, [])
    const rowsData = areaAssign.map((item, index) => ({ ...item, rowNumber: index + 1 }));
    return (

        <>
            <div className='myTbl'>
                <div style={{ height: '85vh', width: '100%' }}>
                    <DataGrid
                        rows={rowsData}
                        columns={columns}
                        getRowId={(params) => {
                            return params.rowNumber
                        }}
                        style={{ fontFamily: 'Poppins', padding: 5, backgroundColor: 'white', }}
                        className='rounded'
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            ...areaAssign.initialState,
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        components={{
                            Toolbar: GridToolbar,
                            NoRowsOverlay: () => (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span>There is no Enquiry with current branch</span>
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

         
        </>

    )
}
