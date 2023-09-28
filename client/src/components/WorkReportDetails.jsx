import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  getUserListFromDb,
  clearUserListState,
} from "../redux/slices/getUserListSlice";
import { setEditUserData } from "../redux/slices/editUserDataSlice";
import { useSelector, useDispatch } from "react-redux";
import { setShowMessage } from "../redux/slices/notificationSlice";
import AlertDeleteModal from "./AlertDelete/AlertDeleteModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import Checkbox from "@mui/material/Checkbox";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { Tooltip } from "@mui/material";
import edit from "../assets/images/editu.png";
import { Button } from "react-bootstrap";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Axios from "axios";
import moment from "moment";
import swipe from "../assets/images/swipe.png";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "../styles/Users.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
export default function WorkReportDetails() {
  const location = useLocation();
  const EmployeeId = location.state.report.EmployeeId;
  const [userListData, setUserListData] = useState([]);
  const [type, setType] = useState(null);
  const [workReport, setWorkReport] = useState([]);
  const [id, setId] = useState(null);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userListState = useSelector(
    (state) => state.getUserListSlice.userListState
  );
  const [selectAll, setSelectAll] = useState(false);
  const [rowData, setRowData] = useState([]);

  const handleHeaderCheckboxClick = () => {
    console.log(!selectAll, "selectAll");
    setSelectAll(!selectAll);
  };

  async function getWorkReport(EmployeeId) {
    const url = `${process.env.REACT_APP_NODE_URL}/api/get-work-report-details/${EmployeeId}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          console.log("ehshd", response.data.result);
          setWorkReport(response.data.result);
        }
      }
    });
  }
  useEffect(() => {
    if (EmployeeId) {
      getWorkReport(EmployeeId);
    }
  }, [EmployeeId]);
  const handleChildCheckboxClick = (itemId) => {
    const updatedRowsData = rowData.map((row) => {
      if (row.EmployeeId === itemId) {
        console.log(row.id, "updatedRowsData");
        return {
          ...row,
          checkbox: !row.checkbox,
        };
      }
      return row;
    });
    setRowData(updatedRowsData);
  };

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
          onClick={() => handleChildCheckboxClick(params.row.EmployeeId)}
        />
      ),
    },
    {
      field: "Employee",
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      headerName: "Employee",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => {
        return `${params.row.Employee ? params.row.Employee : "-"}`;
      },
    },
    {
      field: "tasktype_name",
      headerAlign: "left",
      align: "left",
      headerClassName: "custom-header",
      headerName: "Task Type",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => {
        return `${params.row.tasktype_name ? params.row.tasktype_name : "-"}`;
      },
    },
    {
      field: "task_name",
      headerAlign: "left",
      align: "left",
      headerClassName: "custom-header",
      headerName: "Task Name",
      minWidth: 200,
      flex: 1.2,
      valueGetter: (params) => {
        return `${params.row.task_name ? params.row.task_name : "-"}`;
      },
    },
    {
      field: "work_description",
      headerAlign: "left",
      align: "left",
      headerClassName: "custom-header",
      headerName: "Work Description",
      minWidth: 200,
      flex: 1.2,
      valueGetter: (params) => {
        return `${
          params.row.work_description ? params.row.work_description : "-"
        }`;
      },
    },
    {
      field: "datetime",
      headerAlign: "left",
      align: "left",
      headerClassName: "custom-header",
      headerName: "Date Time",
      minWidth: 200,
      flex: 1.2,
      valueGetter: (params) => {
        if (params.row.datetime) {
          const dateTimeParts = params.row.datetime.split("T");
          const date = dateTimeParts[0];
          const time = dateTimeParts[1].substring(0, 8); // Extract the first 8 characters for the time
          return `${date} ${time}`;
        } else {
          return "-";
        }
      },
    },
    {
      field: "spendtime",
      headerAlign: "left",
      align: "left",
      headerClassName: "custom-header",
      headerName: "Spend Time",
      minWidth: 200,
      flex: 1.2,
      valueGetter: (params) => {
        return `${params.row.spendtime ? params.row.spendtime : "-"}`;
      },
    },
  ];

  useEffect(() => {
    const rowsData = workReport.map((item, index) => ({
      ...item,
      rowNumber: index + 1,
      checkbox: selectAll,
    }));
    setRowData(rowsData);
  }, [workReport, selectAll]);

  const deleteActionCall = (data) => {
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
    console.log(id, "idddddddddddddddddddddddd");
    await Axios.get(url, config).then((response) => {
      console.log(response, "response.data ");
      if (response.data && response.data.isSuccess) {
        console.log(response.data, "delete true");
        dispatch(setShowMessage("User Deleted"));
        dispatch(getUserListFromDb());
        setDisplayConfirmationModal(false);
      } else {
        console.log(response.data, "false");
        dispatch(setShowMessage("failed to delete"));
      }
    });
  };

  useEffect(() => {
    // console.log('userListState', userListState);
    dispatch(getUserListFromDb());
  }, []);

  function editActionCall(data) {
    dispatch(setEditUserData(data));
    navigate("/administration/users/edit");
  }
  const redirectModal = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="">
        {/* <NavLink to={/edit-user}>callme</NavLink > */}

        <div className="my-3  d-flex align-items-end justify-content-end">
          <Button
            variant="btn btn-warning mx-1"
            style={{ width: '70px', height: '35px', fontSize: '14px', borderRadius: '20px' }}
            onClick={() => {
              redirectModal();
            }}
          >
            BACK
          </Button>

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
              ...workReport.initialState,
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
