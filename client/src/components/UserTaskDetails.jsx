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
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";

import "../styles/Users.css";
export default function UserTaskDetails() {
    const location = useLocation();
    const userdata = location.state ? location.state.taskdata : {};
    const Id = userdata.id;
    const taskId = userdata.task;
    const tasktype = userdata.tasktype;
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

  async function getWorkTaskDetail(Id, tasktype, taskId) {
    const url = `${process.env.REACT_APP_NODE_URL}/api/get-work-report-details/${Id}/${tasktype}/${taskId}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          console.log("ehshd", response.data);
          setTask(response.data.result);
        }
      }
    });
  }
  useEffect(() => {
    getWorkTaskDetail(Id, tasktype, taskId);
  }, []); 
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
    console.log(updatedRowsData, "updatedRowsData");
    setRowData(updatedRowsData);
  };

  const formatDate = (startdate) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(startdate).toLocaleDateString(undefined, options);
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
      field: "employee",
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
      headerName: "Task",
      minWidth: 200,
      flex: 1.2,
      valueGetter: (params) => {
        return `${params.row.task_name ? params.row.task_name : "-"}`;
      },
    },
    {
      field: "datetime",
      headerAlign: "left",
      align: "left",
      headerClassName: "custom-header",
      headerName: "Date",
      minWidth: 200,
      flex: 1.2,
      valueGetter: (params) => formatDate(params.row.datetime),
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
        return `${params.row.spendtime ? params.row.spendtime : "-"}`;
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

 const redirectModal = () => {
   navigate(-1);
 };
  return (
    <>
      <div>
        <div className="mb-3 d-flex align-items-end justify-content-end">
          <Button
            variant="btn btn-warning"
            style={{
              width: "70px",
              height: "35px",
              fontSize: "14px",
              borderRadius: "20px",
              marginLeft: "10px",
            }}
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
