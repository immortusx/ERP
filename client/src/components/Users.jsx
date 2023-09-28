import React, { useState, useEffect, useMemo, useRef } from 'react'
import { getUserListFromDb, clearUserListState } from '../redux/slices/getUserListSlice'
import { setEditUserData } from '../redux/slices/editUserDataSlice'
import { useSelector, useDispatch } from 'react-redux'
import { setShowMessage } from "../redux/slices/notificationSlice";
import AlertDeleteModal from "./AlertDelete/AlertDeleteModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import Checkbox from '@mui/material/Checkbox'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Tooltip } from "@mui/material";
import edit from "../assets/images/editu.png";

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
  const [type, setType] = useState(null);
  const [id, setId] = useState(null);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userListState = useSelector(state => state.getUserListSlice.userListState);

  const [selectAll, setSelectAll] = useState(false);
  const [rowData, setRowData] = useState([]);

  const handleHeaderCheckboxClick = () => {
    console.log(!selectAll, "selectAll");
    setSelectAll(!selectAll);
  };

  const handleChildCheckboxClick = (itemId) => {
    const updatedRowsData = rowData.map((row) => {
      if (row.id === itemId) {
        console.log(row.id, "updatedRowsData");
        return {
          ...row,
          checkbox: !row.checkbox, // Toggle the checkbox value
        };
      }
      return row;
    });
    setRowData(updatedRowsData);
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const columns = [
    {
      field: "rowNumberd",
      // headerAlign: "center",
      // align: "center",
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
      field: "User type",
      headerAlign: "center",
      align: "center",
      headerName: "User type",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="currentColor"
            className="bi bi-person-gear"
            viewBox="0 0 16 16"
          >
            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
          </svg>
        </div>
      ),
    },
    {
      field: "first_name",
      headerAlign: "left",
      align: "left",
      headerName: "First Name",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const fistName = params.row.first_name || "-";
        return (
          <div className='myBtnForEdit'
            onClick={() => {
              editActionCall(params.row);
            }}
          >
            {fistName}
          </div>
        );
      },
    },
    {
      field: "last_name",
      headerName: "Last Name",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const lastName = params.row.last_name || "-";
        return (
          <div className='myBtnForEdit'
            onClick={() => {
              editActionCall(params.row);
            }}
          >
            {lastName}
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "left",
      align: "left",
      type: "text",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "is_active",
      headerName: "Active",
      headerAlign: "center",
      align: "center",
      type: "number",
      minWidth: 80,
      flex: 1,
      renderCell: (params) =>
        params.row.is_active ? <CheckIcon /> : <ClearIcon />,
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
      maxWidth: 50,
      // flex: 1,
      position: "sticky",
      renderCell: (params) => (
        <div className="d-flex justify-content-center dotHover">
          <FontAwesomeIcon icon={faEllipsisV} />
          <div className="expandDiv">
            <Tooltip title="Edit">
              <button
                onClick={() => {
                  editActionCall(params.row);
                }}
                className="myActionBtn m-1"
              >
                <img src={edit} alt="Logo" height={20} width={20} />
              </button>
            </Tooltip>
            <Tooltip title="Delete">
              <button
                className="myActionBtn m-1"
                onClick={() => {
                  deleteActionCall(params.row);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-trash3"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                </svg>
              </button>
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const rowsData = userListData.map((item, index) => ({
      ...item,
      rowNumber: index + 1,
      checkbox: selectAll,
    }));
    setRowData(rowsData);
  }, [userListData, selectAll]);

  // const rowsData = userListData.map((item, index) => ({ ...item, rowNumber: index + 1 }));

  const deleteActionCall = (data) => {
    console.log(data, "uuuuuuuuuuuuuuuuuuu")
    setType("user_delete");
    setId(data.id);
    setDeleteMessage(
      `Are You Sure You Want To Delete The User '${data.first_name} ${data.last_name}'?`
    );
    setDisplayConfirmationModal(true);
  };
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };
  const submitDelete = async (type, id) => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/users/delete-user/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    console.log(id, "idddddddddddddddddddddddd")
    await Axios.get(url, config).then((response) => {
      console.log(response, "response.data ");
      if (response.data && response.data.isSuccess) {

        console.log(response.data, "delete true");
        dispatch(setShowMessage("User Deleted"));
        dispatch(getUserListFromDb())
        setDisplayConfirmationModal(false);
      } else {
        console.log(response.data, "false");
        dispatch(setShowMessage("failed to delete"));
      }
    });
  };

  useEffect(() => {
    // console.log('userListState', userListState);
    dispatch(getUserListFromDb())
  }, [])
  useEffect(() => {
    if (userListState.isSuccess) {
      if (userListState.list.isSuccess) {
        setUserListData(userListState.list.result)
      }

    }
  }, [userListState])
  function editActionCall(data) {
    dispatch(setEditUserData(data))
    navigate('/administration/users/edit')
  }
  return (
    <>
      <div className="">
        {/* <NavLink to={/edit-user}>callme</NavLink > */}
        <div className="my-3  d-flex align-items-end justify-content-end">
          <div
            onClick={() => {
              navigate("/administration/users/add");
            }}
            className="d-flex align-items-center"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            <h6 className="m-0 ps-1">Add user</h6>
          </div>
        </div>

        <div
          className="tableMenuHover"
          style={{ height: "85vh", width: "100%" }}
        >
          <DataGrid
            rows={rowData}
            columns={columns}
            getRowId={(params) => {
              return params.rowNumber;
            }}
            className="rounded"
            style={{
              fontFamily: "Poppins",
              padding: 5,
              backgroundColor: "white",
            }}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              ...userListData.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            components={{
              Toolbar: GridToolbar,
              NoRowsOverlay: () => (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>There is no Users with current branch</span>
                </div>
              ),
            }}
            componentsProps={{
              toolbar: {
                position: "right",
                style: { fontFamily: "Poppins", alignSelf: "end" },
              },
            }}
            rowSelection={false}
            autoPageSize={false}
          />
        </div>
      </div>
      <AlertDeleteModal
        showModal={displayConfirmationModal}
        confirmModal={submitDelete}
        hideModal={hideConfirmationModal}
        type={type}
        id={id}
        message={deleteMessage}
      />
    </>
  );
}
