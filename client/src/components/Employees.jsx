import React, { useState, useEffect, useMemo, employeeef, useCallback } from "react";
import {
  getemployeeListFromDb,
  clearemployeeListState,
} from "../redux/slices/getemployeeListSlice";
import { setEditemployeeData } from "../redux/slices/editemployeeDataSlice";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import ShopIcon from "@mui/icons-material/Shop";
import IosShareIcon from "@mui/icons-material/IosShare";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import DownloadIcon from "@mui/icons-material/Download";
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { setEdiassignareaData } from "../redux/slices/editassignareaSlice";
import AreaAssignListList from "./AreaAssignListList";
import { Tooltip } from "@mui/material";
import location from "../assets/images/location.png";
import Checkbox from "@mui/material/Checkbox";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import workAssign from "../assets/images/clipboard.png";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Axios from "axios";
import moment from "moment";

import "../styles/Users.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { setShowMessage } from "../redux/slices/notificationSlice";
import AlertDeleteModal from "./AlertDelete/AlertDeleteModal";
import axios from "axios";
import { color } from "@mui/system";

export default function Employees() {
  const [selectAll, setSelectAll] = useState(false);
  const [rowData, setRowData] = useState([]);

  const handleHeaderCheckboxClick = () => {
    console.log(!selectAll, "selectAll");
    setSelectAll(!selectAll);
  };

  const handleChildCheckboxClick = (itemId) => {
    console.log(itemId, 'itemkf')
    const updatedRowsData = rowData.map((row) => {
      if (row.id === itemId) {
        console.log(row.id, "updatedRowsDataaaaaaaaaaaaaa");
        return {
          ...row,
          checkbox: !row.checkbox, // Toggle the checkbox value
        };
      }
      return row;
    });
    setRowData(updatedRowsData);

    // Update selected items array
    const updatedSelectedItems = updatedRowsData
      .filter((row) => row.checkbox)
      .map((row) => row.id);
    console.log(updatedSelectedItems, "updatedSelectedItems");
    setSelectedEmployeeIDs(updatedSelectedItems);
    setSelectedEmployeeIds(updatedSelectedItems);
  };


  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [employeeListData, setEmployeeListData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [type, setType] = useState(null);
  const [selectedEmployeeIDs, setSelectedEmployeeIDs] = useState([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [id, setId] = useState(null);
  const employeeListState = useSelector(
    (state) => state.getemployeeListSlice.employeeListState
  );

  const [assigneAreaPerUser, setAssignedAreaPerUser] = useState([]);
  const [assigneAreaPerUserid, setAssignedAreaPerUserId] = useState([]);
  const [showComponent, setShowComponent] = useState(false);

  const checkTabGrant = useCallback((pathAr) => {
    let success = false;
    const rolesArray = localStorage.getItem("rolesArray");
    console.log(rolesArray, 'roleAraya')
    const checkList = rolesArray.split(",");
    pathAr.forEach((element) => {
      if (checkList.includes(element)) {
        success = true;
      }
    });
    return success;
  }, []);
  const handleEditArea = async (ev) => {
    try {
      // console.log(ev.group_id, "evvvvvv");
      console.log(ev.user_id, "evvvvvv");

      const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/add-areaAssignUserById/${ev.user_id}`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };

      const response = await Axios.get(url, config);

      if (response.data && response.data.isSuccess) {
        console.log("response.data", response.data.result);
        console.log("ev", ev);

        const groupedData = {};

        for (const item of response.data.result) {
          const {
            id,
            user_id,
            category_id,
            distribution_id,
            dType,
            first_name,
            last_name,
            phone_number,
            group_id
          } = item;

          if (!groupedData[category_id]) {
            groupedData[category_id] = {
              id: id,
              group_id: group_id,
              userId: user_id,
              fname: first_name,
              lname: last_name,
              phonenumber: phone_number,
              distributiontype: dType,
              categoryData: { label: item.category_name, value: category_id },
              villageData: [{ label: item.name, value: distribution_id }],
            };
          } else {
            if (
              !groupedData[category_id].villageData.some(
                (village) => village.value === distribution_id
              )
            ) {
              groupedData[category_id].villageData.push({
                label: item.name,
                value: distribution_id,
              });
            }
          }
        }

        console.log(Object.values(groupedData));

        navigate("/sale/area-Assign/add-AsignArea", {
          state: { assigneAreaPerUser: Object.values(groupedData) },
        });
      } else {
        console.log(
          "No data received from the server or the request was not successful."
        );
        setShowComponent(true);
        console.log(ev.user_id, "ev");
        setId(ev.user_id);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const handleEditWork = async (username) => {
    navigate("/administration/configuration/Task/AssignTask", {
      state: { username: username },
    });
    setShowComponent(true);
    setId(username);
  }



  const hideareamodal = () => {
    setShowComponent(false);
  };
  const columns = [
    {
      field: "id",
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
      field: "employee type",
      headerAlign: "center",
      align: "center",
      headerName: "Employee Type",
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
      valueGetter: (params) => {
        return `${params.row.first_name ? params.row.first_name : "-"}`;
      },
    },
    {
      field: "last_name",
      headerName: "Last Name",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => {
        return `${params.row.last_name ? params.row.last_name : "-"}`;
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
      minWidth: 100,
      flex: 1,
    },
    {
      field: "is_active",
      headerName: "Active",
      headerAlign: "center",
      align: "center",
      type: "number",
      minWidth: 80,
      renderCell: (params) =>
        params.row.is_active ? (
          <CheckIcon className="d-flex justify-content-center" />
        ) : (
          <ClearIcon />
        ),
    },
    {
      field: "menu",
      headerName: <FontAwesomeIcon icon={faEllipsisV} style={{ marginRight: "15px" }} />,
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
        <div className="d-flex justify-content-center dotHoverempicon">
          <FontAwesomeIcon icon={faEllipsisV} />
          <div className="expandDiv">
            <Tooltip title="Edit">
              <button
                onClick={() => {
                  editActionCall(params.row);
                }}
                className="myActionBtn m-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              </button>
            </Tooltip>
            <Tooltip title="Assign Area">
              <button
                onClick={() => {
                  handleEditArea(params.row);
                }}
                className="myActionBtn m-1"
              >
                <img src={location} alt="location" height={20} width={20} />
              </button>
            </Tooltip>
            {checkTabGrant(["assign-task"]) && (

              <Tooltip title="Assign Task">
                <button
                  onClick={() => {
                    handleEditWork(params.row);
                  }}
                  className="myActionBtn m-1"
                >
                  <img src={workAssign} alt="workAssign" height={20} width={20} />
                </button>
              </Tooltip>
            )}
            <Tooltip title="Delete">
              <button
                onClick={() => {
                  deleteActionCall(params.row);
                }}
                className="myActionBtn m-1"
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
    const rowsData = employeeListData.map((item, index) => ({
      ...item,
      id: item.id,
      checkbox: selectAll,
    }));
    setRowData(rowsData);
  }, [employeeListData, selectAll]);

  useEffect(() => {
    dispatch(getemployeeListFromDb());
  }, []);
  useEffect(() => {
    if (employeeListState.isSuccess) {
      if (employeeListState.list.isSuccess) {
        console.log(
          "employeeListState.list.isSuccess",
          employeeListState.list.result
        );
        setEmployeeListData(employeeListState.list.result);
      }
    }
  }, [employeeListState]);
  function editActionCall(data) {
    console.log(data.id);
    console.log(data, 'respoe');
    console.log("editEmployeee");
    dispatch(setEditemployeeData(data));
    navigate("/administration/employees/edit");
  }
  const deleteActionCall = (data) => {
    setType("emplyee_delete");
    setId(data.user_id);
    setDeleteMessage(
      `Are You Sure You Want To Delete The Employee '${data.first_name} ${data.last_name}'?`
    );
    setDisplayConfirmationModal(true);
  };
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };
  const redirectToTask = () => {
    navigate("/administration/configuration/Task/AssignTask", {
      state: { selectedEmployeeIDs: selectedEmployeeIDs }
    });
  }
  const redirectToassign = () => {

    setShowComponent(true);

  }

  const submitDelete = async (type, id) => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/employees/delete-employee/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    console.log(id, "idddddddddddddddddddddddd");
    await axios.get(url, config).then((response) => {
      console.log(response, "response.data ");
      if (response.data && response.data.isSuccess) {
        console.log(response.data, "delete true");
        dispatch(setShowMessage("Employee Deleted"));
        dispatch(getemployeeListFromDb());
        setDisplayConfirmationModal(false);
      } else {
        console.log(response.data, "false");
        dispatch(setShowMessage("failed to delete"));
      }
    });
  };
  return (
    <>
      <div className="">
        {/* <NavLink to={/edit-employee}>callme</NavLink > */}
        <div className="my-3  d-flex align-items-end justify-content-end">
          <div
            onClick={() => {
              navigate("/administration/employees/add");
            }}
            className="d-flex align-items-center myActionBtnicon"
            type="button"
          >
            <Tooltip title="Add Employee">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                className="bi bi-plus-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </Tooltip>
          </div>
          <div
            onClick={() => {
              redirectToassign()
            }}
            className="d-flex align-items-center myActionBtnicon"
            type="button"
            style={{ marginLeft: '10px' }}
          >
            <Tooltip title="Assign Area">
              <img src={location} alt="location" height={22} width={22} />
            </Tooltip>
          </div>
          {checkTabGrant(["assign-task"]) && (
          <div
            className="d-flex align-items-center myActionBtnicon"
            style={{ marginLeft: '10px', cursor: 'pointer' }}
            onClick={redirectToTask}
          >
            <Tooltip title="Assign Task">
              <img src={workAssign} alt="Assign Task" height={24} width={22} />
            </Tooltip>
          </div>
           )}

        </div>

        <div
          className="tableMenuHover"
          style={{ height: "85vh", width: "100%" }}
        >
          <DataGrid
            rows={rowData}
            columns={columns}
            getRowId={(params) => params.id}
            className="rounded"
            style={{
              fontFamily: "Poppins",
              padding: 5,
              backgroundColor: "white",
            }}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              ...employeeListData.initialState,
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
                  <span>There is no employees with current branch</span>
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
      <AreaAssignListList
        showModal={showComponent}
        hideModal={hideareamodal}
        id={id}
        selectedEmployeeIds={selectedEmployeeIds}
      />
    </>
  );
}
