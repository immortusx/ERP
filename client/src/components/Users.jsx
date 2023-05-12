import React, { useState, useEffect, useMemo, useRef } from 'react'
import { getUserListFromDb, clearUserListState } from '../redux/slices/getUserListSlice'
import { setEditUserData } from '../redux/slices/editUserDataSlice'
import { useSelector, useDispatch } from 'react-redux'

import Checkbox from '@mui/material/Checkbox'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from 'axios'
import moment from 'moment'


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import '../styles/Users.css'
import { Link, NavLink, useNavigate } from 'react-router-dom';
export default function Users() {
  const [userListData, setUserListData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userListState = useSelector(state => state.getUserListSlice.userListState);

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
      field: 'User type',
      headerAlign: 'center',
      align: 'center',
      headerName: 'User type',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-person-gear" viewBox="0 0 16 16">
            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
          </svg>
        </div>
      ),
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
    {
      field: 'email',
      headerName: 'Email',
      headerAlign: 'left',
      align: 'left',
      type: 'text',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'phone_number',
      headerName: 'Phone Number',
      // description: 'This column has a value getter and is not sortable.',
      // sortable: false,
      minWidth: 200,
      flex: 1,
      // valueGetter: (params) =>
      //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
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
          <button onClick={() => { editActionCall(params.row) }} className='myActionBtn m-1'>
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
        </div>
      ),
    }
  ];
  const rowsData = userListData.map((item, index) => ({ ...item, rowNumber: index + 1 }));


  useEffect(() => {
    // console.log('userListState', userListState);
    dispatch(getUserListFromDb())
  }, [])
  useEffect(() => {
    if (userListState.isSuccess) {
      if (userListState.list.isSuccess) {

        console.log('userListState.list.isSuccess', userListState.list.result)
        setUserListData(userListState.list.result)
      }

    }
  }, [userListState])
  function editActionCall(data) {
    dispatch(setEditUserData(data))
    navigate('/home/edit-user')
  }
  return (
    <>
      <div className=''>
        {/* <NavLink to={/edit-user}>callme</NavLink > */}
        <div className='my-3  d-flex align-items-end justify-content-end'>
          <div onClick={() => { navigate('/home/add-user') }} className='d-flex align-items-center' type='button'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            <h6 className='m-0 ps-1'>
              Add user
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
              ...userListData.initialState,
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
    </>
  )
}
