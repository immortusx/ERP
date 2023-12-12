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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Axios from "axios";
import moment from "moment";
import swipe from '../assets/images/swipe.png';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Button } from "react-bootstrap";
import "../styles/Users.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
export default function WorkReport() {
  const [userListData, setUserListData] = useState([]);
  const [type, setType] = useState(null);
  const [workReport, setWorkReport] = useState([]);
  const [today, setToday] = useState(false);
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
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

  const loadMoreReport = (report) => {
    navigate('/administration/report/workreport/details', {
      state: {
        report: report
      }
    })
  }
  const handleChildCheckboxClick = (itemId) => {
    console.log(itemId, "itemId");
    const updatedRowsData = rowData.map((row) => {
      if (row.EmployeeId === itemId) {
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
      // flex: 1,
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
      renderCell: (params) => {
        const employeeName = params.row.Employee || "-";
        return (
          <div
            className="myBtnWorkReport"
            onClick={() => {
              loadMoreReport(params.row);
            }}
          >
            {employeeName}
          </div>
        );
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
      field: "TaskCompleted",
      headerAlign: "left",
      align: "left",
      headerClassName: "custom-header",
      headerName: "Task Completed",
      minWidth: 200,
      flex: 1.2,
      valueGetter: (params) => {
        if (
          params.row.TaskCompleted !== null &&
          params.row.TaskCompleted !== undefined
        ) {
          return `${params.row.TaskCompleted} / ${params.row.TotalTask}`;
        } else {
          return "-";
        }
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
        return `${params.row.work_description ? params.row.work_description : "-"
          }`;
      },
    },
    {
      field: "menu",
      headerName: (
        <FontAwesomeIcon icon={faEllipsisV} style={{ marginRight: "15px" }} />
      ),
      className: "bg-dark",
      sortable: false,
      filterable: false,
      headerAlign: "right",
      align: "right",
      disableColumnMenu: true,
      width: 130,
      // flex: 1,
      position: "sticky",
      renderCell: (params) => (
        <div className="d-flex justify-content-center dotHoverempicon ">
          <FontAwesomeIcon icon={faEllipsisV} />
          <div className="expandDiv">
            <Tooltip title="Details">
              <button
                onClick={() => {
                  loadMoreReport(params.row);
                }}
                className="myActionBtn m-1"
              >
                <img src={swipe} alt="Details" height={20} width={20} />
              </button>
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    console.log(workReport, "workReport");
    const rowsData = workReport.map((item, index) => ({
      ...item,
      rowNumber: item.EmployeeId,
      checkbox: selectAll,
    }));
    setRowData(rowsData);
    console.log(rowsData, "item")
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
  const getTodayWorkReport = async () => {
    try {
      const url = `${process.env.REACT_APP_NODE_URL}/api/get-employee-work-report-today`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };

      const response = await Axios.get(url, config);

      if (response.data && response.data.isSuccess) {
        console.log("Today's Work Report", response.data.result);
        setWorkReport(response.data.result);
        setToday(true);
        setWeekly(false);
        setMonthly(false);
      } else {
        console.error("Failed to fetch today's work report");
      }
    } catch (error) {
      console.error("An error occurred while fetching today's work report", error);
    }
  }
  const getWeeklyWorkReport = async () => {
    try {
      const url = `${process.env.REACT_APP_NODE_URL}/api/get-employee-work-report-weekly`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };

      const response = await Axios.get(url, config);

      if (response.data && response.data.isSuccess) {
        console.log("Weekly Work Report", response.data.result);
        setWorkReport(response.data.result);
        setWeekly(true);
        setToday(false);
        setMonthly(false);
      } else {
        console.error("Failed to fetch Weekly work report");
      }
    } catch (error) {
      console.error("An error occurred while fetching Weekly work report", error);
    }
  }

  const getMonthlyWorkReport = async () => {
    try {
      const url = `${process.env.REACT_APP_NODE_URL}/api/get-employee-work-report-monthly`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
      const response = await Axios.get(url, config);

      if (response.data && response.data.isSuccess) {
        console.log("Monthly Work Report", response.data.result);
        setWorkReport(response.data.result);
        setMonthly(true);
        setWeekly(false);
        setToday(false);
      } else {
        console.error("Failed to fetch Monthly work report");
      }
    } catch (error) {
      console.error("An error occurred while fetching Monthly work report", error);
    }
  }
  useEffect(() => {
    // console.log('userListState', userListState);
    dispatch(getUserListFromDb());
  }, []);

  async function getEmployeeWorkReport() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/get-employee-work-report`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          console.log("workReport", response.data);
          setWorkReport(response.data.result);
        }
      }
    });
  }
  useEffect(() => {
    getEmployeeWorkReport();
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
          <button onClick={getTodayWorkReport} className={`d-flex align-items-center btnworkreport ${today ? 'bg-white today-text' : ''}`} >
            Today
          </button>
          <button onClick={getWeeklyWorkReport} className={`d-flex align-items-center btnworkreport ${weekly ? 'bg-white today-text' : ''}`} style={{ marginLeft: '10px' }}>
            Weekly
          </button>
          <button onClick={getMonthlyWorkReport} className={`d-flex align-items-center btnworkreport ${monthly ? 'bg-white today-text' : ''}`} style={{ marginLeft: '10px' }}>
            Monthly
          </button>

          <Button
            variant="btn btn-warning mx-1"
            style={{ width: '70px', height: '32px', fontSize: '14px', borderRadius: '20px' }}
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
