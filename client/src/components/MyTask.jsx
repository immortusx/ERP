import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  getUserListFromDb,
  clearUserListState,
} from "../redux/slices/getUserListSlice";
import { setEditUserData } from "../redux/slices/editUserDataSlice";
import { useSelector, useDispatch } from "react-redux";
import { setShowMessage } from "../redux/slices/notificationSlice";
import AlertDeleteModal from "./AlertDelete/AlertDeleteModal";
import Checkbox from "@mui/material/Checkbox";
import { Tooltip } from "@mui/material";
import edit from "../assets/images/editu.png";
import { Button } from "react-bootstrap";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Axios from "axios";

import "../styles/Users.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
export default function MyTask() {

    const [task, setTask] = useState([]);
   
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

  async function getWorkTaskDetail() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/get-user-task-list`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          console.log("ehshd", response.data.result);
          setTask(response.data.result);
        }
      }
    });
  }
  useEffect(() => {
    getWorkTaskDetail();
  }, []);
  const handleChildCheckboxClick = (itemId) => {
    const updatedRowsData = rowData.map((row) => {
      if (row.id === itemId) {
        return {
          ...row,
          checkbox: !row.checkbox,
        };
      }
      return row;
    });
    console.log(updatedRowsData, "updatedRowsData");
    setRowData(updatedRowsData);
  };


const formatDate = (startdate) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(startdate).toLocaleDateString(undefined, options);
};

const handletaskdetail = (data) => {
  navigate("/management/mytask/task-detail", {
    state: { taskdata: data },
  });
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
          onClick={() => handleChildCheckboxClick(params.row.id)}
        />
      ),
    },
    {
      field: "employee",
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      headerName: "Employee",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => {
        return `${params.row.employee ? params.row.employee : "-"}`;
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
      headerName: "Task",
      minWidth: 200,
      flex: 1.2,
      valueGetter: (params) => {
        return `${params.row.task_name ? params.row.task_name : "-"}`;
      },
    },
    {
      field: "taskcount",
      headerAlign: "left",
      align: "left",
      headerClassName: "custom-header",
      headerName: "TaskCount",
      minWidth: 200,
      flex: 1.2,
      renderCell: (params) => (
        <button
          className="border-0 rounded p-2"
          onClick={() => handletaskdetail(params.row)}
        >
          {`${params.row.taskCompleted ? params.row.taskCompleted : 0}/${
            params.row.taskcount ? params.row.taskcount : "-"
          }`}
        </button>
      ),
    },

    {
      field: "startdate",
      headerAlign: "left",
      align: "left",
      headerClassName: "custom-header",
      headerName: "Start Date",
      minWidth: 200,
      flex: 1.2,
      valueGetter: (params) => formatDate(params.row.startdate),
    },
    {
      field: "enddate",
      headerAlign: "left",
      align: "left",
      headerClassName: "custom-header",
      headerName: "End Date",
      minWidth: 200,
      flex: 1.2,
      valueGetter: (params) => formatDate(params.row.enddate),
    },
    {
      field: "period_name",
      headerAlign: "left",
      align: "left",
      headerClassName: "custom-header",
      headerName: "Task Time Period",
      minWidth: 200,
      flex: 1.2,
      valueGetter: (params) => {
        return `${params.row.period_name ? params.row.period_name : "-"}`;
      },
    },
  ];

  useEffect(() => {
    const rowsData = task.map((item, index) => ({
      ...item,
      rowNumber: index + 1,
      checkbox: selectAll,
    }));
    setRowData(rowsData);
  }, [task, selectAll]);


  useEffect(() => {
    dispatch(getUserListFromDb());
  }, []);

 
//   const redirectModal = () => {
//     navigate(-1);
//   };
  return (
    <>
      <div className="">
        {/* <NavLink to={/edit-user}>callme</NavLink > */}

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
              ...task.initialState,
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
    </>
  );
}
