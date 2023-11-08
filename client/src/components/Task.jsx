import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowMessage } from "../redux/slices/notificationSlice";
import AlertDeleteModal from "./AlertDelete/AlertDeleteModal";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Checkbox from '@mui/material/Checkbox'
import { Link, NavLink, useNavigate } from "react-router-dom";
import Axios from "axios";
import moment from "moment";
import { gettaskAssignListFromDb, cleartaskAssignListState } from '../redux/slices/gettaskAssignListSlice'
import { Tooltip } from "@mui/material";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import translations from '../assets/locals/translations';
import { setEditTaskAssignData } from "../redux/slices/editTaskAssignSlice";
const Task = () => {

   const [rowData, setRowData] = useState([]);
   const [selectAll, setSelectAll] = useState(false);
   const [taskData, setTaskData] = useState([]);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [type, setType] = useState(null);
   const [taskStatus, setTaskStatus] = useState('1');
   const [statusVisible, setStatusVisible] = useState('none');
   const [statusDropDown, setStatusDropDown] = useState('none');
   const [id, setId] = useState(null);
   const [deleteMessage, setDeleteMessage] = useState(null);
   const [deleteTaskAssignId, setDeleteTaskAssignId] = useState(null);
   const [showDropDown, setShowDropDown] = useState(false);
   const [displayConfirmationModal, setDisplayConfirmationModal] =
      useState(false);
   const currentBranch = localStorage.getItem("currentDealerId");
   const [selectedRowId, setSelectedRowId] = useState(null);
   const [showSelectionBox, setShowSelectionBox] = useState({});
   const currentLanguage = useSelector((state) => state.language.language);
   const handleHeaderCheckboxClick = () => {
      setSelectAll(!selectAll);
   }


   function editTaskModal(data) {
      navigate("/administration/configuration/Task/edit", { state: { data: data } });
   }

   const deleteActionCall = (data) => {
      console.log(data, 'errogrogog')
      setType("taskassign_delete");
      setDeleteTaskAssignId(data.id);
      setDeleteMessage(
         `Are You Sure You Want To Delete The category '${data.employee}'?`
      );
      setDisplayConfirmationModal(true);
   };

   const hideConfirmationModal = () => {
      setDisplayConfirmationModal(false);
   };


   async function getTaskList() {
      const url = `${process.env.REACT_APP_NODE_URL}/api/get-task-list`;
      const config = {
         headers: {
            token: localStorage.getItem("rbacToken"),
         },
      };

      const response = await Axios.get(url, config);
      if (response.data && response.data.isSuccess) {
         const formattedData = response.data.result.map((user, index) => ({
            id: user.id,
            employee: user.employee,
            tasktype: user.tasktype_name,
            task: user.task_name,
            taskcount: user.taskcount,
            startdate: moment(user.startdate).format('LL'),
            enddate: moment(user.enddate).format('LL'),
            tasktimeperiod: user.period_name,
            EmployeeId: user.EmployeeId,
            taskstatus: user.task_status,
            taskcategory: user.category_name

         }));

         setTaskData(formattedData);
      }
   }
   useEffect(() => {
      getTaskList();
   }, []);
   const submitDelete = async () => {
      if (deleteTaskAssignId) {
         console.log(deleteTaskAssignId, "iiiiiiiiiiiiiiii");
         const url = `${process.env.REACT_APP_NODE_URL}/api/delete-taskassign/${deleteTaskAssignId}`;
         const config = {
            headers: {
               token: localStorage.getItem("rbacToken"),
            },
         };
         try {
            const response = await Axios.get(url, config);
            console.log(response, "response.data");
            if (response.data && response.data.isSuccess) {
               dispatch(setShowMessage("Task Deleted"));
               getTaskList();
               setDisplayConfirmationModal(false);
            } else {
               console.log(response.data, "false");
               dispatch(setShowMessage("Failed to delete"));
            }
         } catch (error) {
            console.error("Error while deleting task:", error);
         }
      }
   };

   const [newAddTask, setNewAddTask] = useState({
      listTaskStatus: [],
   });

   function taskAssignStatus(id, newStatus) {
      const url = `${process.env.REACT_APP_NODE_URL}/api/update-taskstatus/${id}/${newStatus}`;
      const config = {
         headers: {
            token: localStorage.getItem("rbacToken"),
         },
      };

      Axios.get(url, config)
         .then((response) => {
            if (response.data) {
               if (response.data.result === 'success') {
                  getTaskList();
                  setStatusDropDown('status-dropdown');

               }
            }
         })
         .catch((error) => {
            console.error("Error while updating task status:", error);
         });
   }
   // const getColorClass = newAddTask.listTaskStatus
   //    .map((item) => `task-status${item.id}`)
   //    .join(' ');
   const getColorClass = (taskstatus) => {
      switch (taskstatus) {
         case '1':
            return 'task-status-1';
         case '2':
            return 'task-status-2';
         case '3':
            return 'task-status-3';
         case '4':
            return 'task-status-4';
         case '5':
            return 'task-status-5';
         // Add more cases for other task statuses as needed
         default:
            return '';
      }
   };
   const handleTaskStatus = (rowId) => {
      if (showSelectionBox[rowId]) {
         // Selection box is already visible, make it invisible
         setShowSelectionBox((prevState) => ({
            ...prevState,
            [rowId]: false,
         }));
      } else {
         // Selection box is not visible, make it visible
         setShowSelectionBox((prevState) => ({
            ...prevState,
            [rowId]: true,
         }));
      }
   };


   const onChangeTaskStatus = (e, id) => {
      const newStatus = e.target.value;
      taskAssignStatus(id, newStatus);

      // Toggle the visibility of the selection box for the corresponding row
      setShowSelectionBox((prevState) => ({
         ...prevState,
         [id]: false,
      }));

      const updatedRowData = rowData.map((row) => {
         if (row.id === id) {
            return {
               ...row,
               taskstatus: newStatus,
            };
         }
         return row;
      });

      setRowData(updatedRowData);
   };

   async function getlisttaskStatus() {
      const url = `${process.env.REACT_APP_NODE_URL}/api/get-taskstatus-list`;
      const config = {
         headers: {
            token: localStorage.getItem("rbacToken"),
         },
      };
      await Axios.get(url, config).then((response) => {
         if (response.data) {
            if (response.data.isSuccess) {
               setNewAddTask((newAddTask) => ({
                  ...newAddTask,
                  ["listTaskStatus"]: response.data.result,
               }));
            }
         }
      });
   }
   useEffect(() => {
      getlisttaskStatus();

   }, [])
   useEffect(() => {
      gettaskAssignListFromDb();
   }, [])
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
      setRowData(updatedRowsData);
   };

   const label = { inputProps: { "aria-label": "Checkbox demo" } };

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

         field: "employee",
         headerAlign: "left",
         align: "left",
         headerName: translations[currentLanguage].employee,
         minWidth: 200,
         flex: 1,
         renderCell: (params) => {
            const employee = params.row.employee || "-";
            return (
               <div className='myBtnForEdit'
                  onClick={() => {
                     editTaskModal(params.row);
                  }}
               >
                  {employee}
               </div>
            );
         },

      },

      {
         field: "tasktype",
         headerAlign: "left",
         align: "left",
         headerName: translations[currentLanguage].tasktype,
         minWidth: 200,
         flex: 1,
      },
      {
         field: "task",
         headerAlign: "left",
         align: "left",
         headerName: translations[currentLanguage].task,
         minWidth: 200,
         flex: 1,
      },
      {
         field: "taskcategory",
         headerAlign: "left",
         align: "left",
         headerName: translations[currentLanguage].category,
         minWidth: 200,
         flex: 1,
      },
      {
         field: "taskstatus",
         headerAlign: "left",
         align: "left",
         headerName: translations[currentLanguage].taskstatus,
         minWidth: 200,
         flex: 1,
         renderCell: (params) => {
            const taskstatus = params.row.taskstatus || "";
            const colorClass = getColorClass(taskstatus);
            const rowId = params.row.id;

            return (
               <div className="">

                  {
                     showSelectionBox[rowId] ? (
                        <select
                           onChange={(e) => onChangeTaskStatus(e, params.row.id)}
                           className={`${statusDropDown} myInput custom-select px-4 rounded-pill`}
                           name="taskstatus"
                           value={params.row.taskstatus}
                        >
                           {newAddTask.listTaskStatus &&
                              newAddTask.listTaskStatus.length > 0 &&
                              newAddTask.listTaskStatus.map((i) => {
                                 const taskstatus = `${i.task_status}`;
                                 return (
                                    <option key={i.id} value={i.id} className="myLabel">
                                       {taskstatus}
                                    </option>
                                 );
                              })}
                        </select>
                     ) : (
                        <p
                           className={`${statusVisible} ${colorClass} cursorpointer rounded-pill px-4`}
                           onClick={() => handleTaskStatus(rowId)}
                        >
                           {taskstatus == 1 && "New"}
                           {taskstatus == 2 && "In Progress"}
                           {taskstatus == 3 && "On Hold"}
                           {taskstatus == 4 && "Discard"}
                           {taskstatus == 5 && "Done"}
                        </p>
                     )
                  }


               </div>
            );
         },

      },

      {
         field: "taskcount",
         headerAlign: "left",
         align: "left",
         headerName: translations[currentLanguage].taskcount,
         minWidth: 200,
         flex: 1,
      },
      {
         field: "startdate",
         headerAlign: "left",
         align: "left",
         headerName: translations[currentLanguage].startd,
         minWidth: 200,
         flex: 1,
      },
      {
         field: "enddate",
         headerAlign: "left",
         align: "left",
         headerName: translations[currentLanguage].endd,
         minWidth: 200,
         flex: 1,
      },
      {
         field: "tasktimeperiod",
         headerAlign: "left",
         align: "left",
         headerName: translations[currentLanguage].tasktimep,
         minWidth: 200,
         flex: 1,
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
                  <Tooltip title={translations[currentLanguage].edit}>
                     <button
                        className="myActionBtn m-1"
                        onClick={() => {
                           editTaskModal(params.row);
                        }}
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
                  <Tooltip title={translations[currentLanguage].delete}>
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
   ]

   useEffect(() => {
      const rowsData = taskData.map((item, index) => ({
         ...item,
         id: index + 1,
         // id: item.id,
         checkbox: selectAll,
      }));
      setRowData(rowsData);
   }, [taskData, selectAll]);
   const redirectModal = () => {
      navigate(-1);
   };

   return (
      <div className="">
         {/* <NavLink to={/edit-employee}>callme</NavLink > */}
         <div className="my-3  d-flex align-items-end justify-content-end">
            <div
               onClick={() => {
                  navigate("/administration/configuration/Task/AssignTask");
               }}
               className="d-flex align-items-center"
               type="button"
            >
               <Tooltip title={translations[currentLanguage].AssignTask}>
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="23"
                     height="23"
                     fill="currentColor"
                     className="bi bi-plus-circle"
                     viewBox="0 0 16 16"
                  >
                     <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                     <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
               </Tooltip>
               <Button
                  variant="btn btn-warning"
                  style={{ width: '70px', height: '35px', fontSize: '14px', borderRadius: '20px', marginLeft: '10px' }}
                  onClick={() => {
                     redirectModal();
                  }}
               >
                  {translations[currentLanguage].back}
               </Button>
            </div>
         </div>

         <div className="tableMenuHover"
            style={{ height: "85vh", width: "100%" }}>

            <DataGrid
               rows={rowData}
               columns={columns}
               getRowId={(params) => {
                  return params.id
               }}
               className='rounded'
               style={{ fontFamily: 'Poppins', padding: 5, backgroundColor: 'white', }}
               pageSizeOptions={[5, 10, 25]}
               initialState={{
                  ...taskData.initialState,
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
         <AlertDeleteModal
            showModal={displayConfirmationModal}
            confirmModal={submitDelete}
            hideModal={hideConfirmationModal}
            type={type}
            id={deleteTaskAssignId}
            message={deleteMessage}
         />
      </div>
   );


}
export default Task;

