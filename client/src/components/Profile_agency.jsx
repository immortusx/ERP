import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { setShowMessage } from "../../../redux/slices/notificationSlice";
import { useNavigate } from "react-router-dom";
import { getAgency } from "./getEditAgency";
import AlertDeleteModal from "../../AlertDelete/AlertDeleteModal";
import { setEditagencyData } from "../../../redux/slices/editAgencySlice";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function Profile_list({ workFor }) {
  const [partsList, setPartsList] = useState([]);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [type, setType] = useState(null);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getAgencyForm = () => {
    getAgency()
      .then((data) => {
        console.log("Response from getAgency:", data.result);
        setPartsList(data.result);
      })
      .catch((error) => {
        console.error("Error in getAgency:", error);
      });
  };

  useEffect(() => {
    getAgencyForm();
  }, []);

  const columns = [
    {
      field: "id",
      headerAlign: "center",
      align: "center",
      headerName: "No",
      minWidth: 80,
      flex: 1,
    },

    {
      field: "configuration_setting",
      headerAlign: "left",
      align: "left",
      headerName: "AgencyName",
      minWidth: 120,
      flex: 1,
      valueGetter: (params) => {
        return `${
          params.row.configuration_setting
            ? params.row.configuration_setting
            : "-"
        }`;
      },
    },
    {
      field: "contaconfiguration_keyct",
      headerAlign: "left",
      align: "left",
      headerName: "AgencyKey",
      minWidth: 250,
      flex: 1,
      valueGetter: (params) => {
        return `${
          params.row.configuration_key ? params.row.configuration_key : "-"
        }`;
      },
    },
    {
      field: "configuration_value",
      headerAlign: "left",
      align: "left",
      headerName: "AgencyValue",
      minWidth: 250,
      flex: 1,
      valueGetter: (params) => {
        return `${
          params.row.configuration_value ? params.row.configuration_value : "-"
        }`;
      },
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   className: "bg-dark",
    //   sortable: false,
    //   filterable: false,
    //   headerAlign: "center",
    //   align: "center",
    //   disableColumnMenu: true,
    //   minWidth: 80,
    //   flex: 1,
    //   position: "sticky",
    //   renderCell: (params) => (
    //     <div>
    //       {/* <button onClick={() => { editActionCall(params.row) }} className='myActionBtn m-1'> */}
    //       <button
    //         className="myActionBtn m-1"
    //         onClick={() => {
    //           editeStateModal(params.row);
    //         }}
    //       >
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="currentColor"
    //           className="bi bi-pencil-square"
    //           viewBox="0 0 16 16"
    //         >
    //           <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
    //           <path
    //             fillRule="evenodd"
    //             d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
    //           />
    //         </svg>
    //       </button>
    //       <button
    //         // onClick={() => {
    //         //   deleteActionCall(params.row);
    //         // }}
    //         className="myActionBtn m-1"
    //       >
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="currentColor"
    //           className="bi bi-trash3"
    //           viewBox="0 0 16 16"
    //         >
    //           <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
    //         </svg>
    //       </button>

    //       {/* <button className='myActionBtn m-1'
    //                     onClick={() => { deleteStateAlert(params.row) }}
    //                 >
    //                     <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
    //                         <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
    //                     </svg>
    //                 </button> */}
    //     </div>
    //   ),
    // },
  ];

//   const editeStateModal = (data) => {
//     // setTableEditData(data);
//     console.log(data.id);
//     console.log("editEmployeee");
//     dispatch(setEditagencyData(data));
//     console.log(setEditagencyData(data));
//     navigate("/administration/configuration/agency/editagency");
//   };

  // const deleteActionCall = (data) => {
  //   console.log(data.id, "fffffffffffffffffff");
  //   setType("department_delete");
  //   setId(data.id);
  //   setDeleteMessage(
  //     `Are You Sure You Want To Delete The department '${data.name}'?`
  //   );
  //   setDisplayConfirmationModal(true);
  // };

  // const hideConfirmationModal = () => {
  //   setDisplayConfirmationModal(false);
  // };

  // const submitDelete = async () => {
  //   console.log(id, "iiiiiiiiiiiiiiii");
  //   const url = `${process.env.REACT_APP_NODE_URL}/api/master/delete-department`;
  //   const config = {
  //     headers: {
  //       token: localStorage.getItem("rbacToken"),
  //     },
  //   };
  //   const requestData = {
  //     id: id,
  //   };
  //   try {
  //     const response = await Axios.post(url, requestData, config);
  //     if (response.data?.isSuccess) {
  //       getDepartmentForm();
  //       dispatch(setShowMessage("Department Deleted"));
  //       dispatch(addDepartmentToDb);
  //       getDepartment();
  //       setDisplayConfirmationModal(false);
  //     } else {
  //       dispatch(setShowMessage("failed to delete"));
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error(error);
  //     return null;
  //   }
  // };

  return (
    <>
      {/*<div className="my-3 d-flex align-items-end justify-content-end">
        <div className="d-flex align-items-center" type="button">
          <h6 className="m-0 ps-1">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                navigate("/administration/configuration/agency/addagency");
              }}
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
              &nbsp; Add Agency
            </button>
          </h6>
        </div>
            </div> */}
      <div className="addUser myBorder bg-white rounded p-3">
        <div className="mt-4" style={{ height: "85vh", width: "100%" }}>
          <DataGrid
            rows={partsList}
            columns={columns}
            getRowId={(params) => {
              return params.id;
            }}
            className="rounded"
            style={{
              fontFamily: "Poppins",
              padding: 5,
              backgroundColor: "white",
            }}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              //  ...allStateDate.initialState,
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
        {/*<AlertDeleteModal
   showModal={displayConfirmationModal}
   confirmModal={submitDelete}
   hideModal={hideConfirmationModal}
   type={type}
   id={id}
   message={deleteMessage}
          /> */}
      </div>
    </>
  );
}
