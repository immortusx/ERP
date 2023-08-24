import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Checkbox from '@mui/material/Checkbox'
import { Link, NavLink, useNavigate } from "react-router-dom";

const Task = () => {

   const [rowData, setRowData] = useState([]);
   const [selectAll, setSelectAll] = useState(false);
   const [taskData, setTaskData] = useState([]);
   const navigate = useNavigate();


   const handleHeaderCheckboxClick = () => {
      setSelectAll(!selectAll);
   }

   const handleChildCheckboxClick = (itemId) => {
      const updatedRowsData = rowData.map((row) => {
         if (row.rowNumber === itemId) {
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
               onClick={() => handleChildCheckboxClick(params.row.rowNumber)}
            />
         ),
      },
      {

         field: "employee",
         headerAlign: "left",
         align: "left",
         headerName: "Employee",
         minWidth: 120,
         flex: 1,

      },

      {
         field: "tasktype",
         headerAlign: "left",
         align: "left",
         headerName: "Task Type",
         minWidth: 250,
         flex: 1,
      },
      {
         field: "task",
         headerAlign: "left",
         align: "left",
         headerName: "Task",
         minWidth: 250,
         flex: 1,
      },
      {
         field: "taskcount",
         headerAlign: "left",
         align: "left",
         headerName: "Task Count",
         minWidth: 250,
         flex: 1,
      },
      {
         field: "category",
         headerAlign: "left",
         align: "left",
         headerName: "Category",
         minWidth: 250,
         flex: 1,
      },
   ]

   useEffect(() => {
      const rowsData = taskData.map((item, index) => ({
         ...item,
         rowNumber: index + 1,
         checkbox: selectAll,
      }));
      setRowData(rowsData);
   }, [taskData, selectAll]);


   return (
      <div className="">
         {/* <NavLink to={/edit-employee}>callme</NavLink > */}
         <div className="my-3  d-flex align-items-end justify-content-end">
            <div
               onClick={() => {
                  navigate("/administration/configuration/Task/Add-Task");
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
               <h6 className="m-0 ps-1">Add Task</h6>
            </div>
         </div>

         <div className="tableMenuHover"
            style={{ height: "85vh", width: "100%" }}>

            <DataGrid
               rows={rowData}
               columns={columns}
               getRowId={(params) => {
                  return params.rowNumber
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
      </div>
   );


}
export default Task;