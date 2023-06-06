import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import Checkbox from "@mui/material/Checkbox";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

import {
  addManufacturerToDb,
  clearAddManufacturer,
} from "../../../redux/slices/Master/Manufacturer/addManufacturerSlice";
import { setShowMessage } from "../../../redux/slices/notificationSlice";
import { Modal, Button } from "react-bootstrap";
import {
  getAllManufacturerAction,
  getManufacturerById,
  editeManufacturerAction,
  deleteManufacturerAction,
} from "./getEditeManufacturer";
import AlertDeleteModal from "../../AlertDelete/AlertDeleteModal";
import axios from "axios";

export default function Manufacturer_modal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const autoFocusRef = useRef(null);

  const location = useLocation();
  const rowData = [location.state?.rowData];
  const [allMfacturerData, setAllMfacturerData] = useState([]);
  const [editMaFacturerById, setEditMaFacturerById] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [manufacturerID, setManufacturerID] = useState(0);

  //---- Delete Modal Variable -----//
  const [type, setType] = useState(null);
  const [id, setId] = useState(null);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const [modalRowsArr, setModalRowsArr] = useState([]);
  const [firstBlankField, setFirstBlankField] = useState(null);

  const onAddNewRowsHandler = () => {
    setModalRowsArr((prevState) => [
      ...prevState,
      {
        id: new Date().getTime(),
        modalName: "",
        variants: [{ variantName: "" }],
      },
    ]);
  };

  const onAddNewVariantHandler = (modalIndex) => {
    setModalRowsArr((prevState) => {
      const updatedModalRowsArr = [...prevState];
      const modalRow = updatedModalRowsArr[modalIndex];
      modalRow.variants.push({ variantName: "" });
      return updatedModalRowsArr;
    });
  };

  const onRemoveModalHandler = (modalId) => {
    setModalRowsArr((prevState) =>
      prevState.filter((modal) => modal.id !== modalId)
    );
  };

  const onRemoveVariantHandler = (modalId, variantIndex) => {
    setModalRowsArr((prevState) => {
      const updatedModalRowsArr = [...prevState];
      const modalIndex = updatedModalRowsArr.findIndex(
        (modal) => modal.id === modalId
      );
      const modalRow = updatedModalRowsArr[modalIndex];
      modalRow.variants.splice(variantIndex, 1);
      return updatedModalRowsArr;
    });
  };

  const onModalNameChange = (event, modalIndex) => {
    setModalRowsArr((prevState) => {
      const updatedModalRowsArr = [...prevState];
      const modalRow = updatedModalRowsArr[modalIndex];
      modalRow.modalName = event.target.value;
      return updatedModalRowsArr;
    });
  };

  const onVariantNameChange = (event, modalIndex, variantIndex) => {
    setModalRowsArr((prevState) => {
      const updatedModalRowsArr = [...prevState];
      const modalRow = updatedModalRowsArr[modalIndex];
      const variantRow = modalRow.variants[variantIndex];
      variantRow.variantName = event.target.value;
      return updatedModalRowsArr;
    });
  };

  useEffect(() => {
    if (rowData) {
      rowData.map((val) => {
        console.log(val.manufacturerId);
        setManufacturerID(val.manufacturerId);
      });
    }
  }, [rowData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const manufacturerNameData = rowData;
    const manufacturerModalVarData = modalRowsArr;

    let firstBlankFieldIndex = null; // Index of the first blank field

    if (
      manufacturerNameData.length > 0 &&
      manufacturerModalVarData.length > 0
    ) {
      for (let i = 0; i < manufacturerModalVarData.length; i++) {
        const modalRow = manufacturerModalVarData[i];
        if (modalRow.modalName.trim() === "") {
          firstBlankFieldIndex = i;
          break;
        }
        for (let j = 0; j < modalRow.variants.length; j++) {
          const variantRow = modalRow.variants[j];
          if (variantRow.variantName.trim() === "") {
            firstBlankFieldIndex = i;
            break;
          }
        }
      }

      if (firstBlankFieldIndex === null) {
        // All fields are filled, submit the data #manufacturerId
        console.log(manufacturerModalVarData);
        console.log(manufacturerNameData, "row");

        const url = `${process.env.REACT_APP_NODE_URL}/api/master/addmodal-variant`;
        const config = {
          headers: {
            token: localStorage.getItem("rbacToken"),
          },
        };
        const requestData = {
          manufacturerModalVarData: manufacturerModalVarData,
          manufacturerId: manufacturerID,
        };

        await axios.post(url, requestData, config).then((response) => {
          if (response.data && response.data.isSuccess) {
            redirectaddmodal();
            dispatch(setShowMessage("Data Successfully Saved."));
            // console.log(response.data.result)
          }
        });
      } else {
        // Set focus on the first blank field
        setFirstBlankField(firstBlankFieldIndex);
      }
    } else {
      dispatch(setShowMessage("All Field Must be Required."));
    }
  };

  const redirectaddmodal = () => {
    navigate("/administration/configuration/manufacturer-list");
  };

  const ErrorMsg = () => {
    dispatch(setShowMessage("All Field Must be Required."));
  };
  useEffect(() => {
    if (firstBlankField !== null && autoFocusRef.current) {
      autoFocusRef.current.focus();
    }
  }, [firstBlankField]);

  useEffect(() => {
    onAddNewRowsHandler();
  }, []);

  const columns = [
    {
      field: "rowNumber",
      headerAlign: "center",
      align: "center",
      headerName: "No",
      minWidth: 80,
      flex: 1,
    },
    {
      field: "manufacturerName",
      headerAlign: "center",
      align: "center",
      headerName: "Manufacturer Name",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div>
          <button
            className="mfacturerActionBtn"
            onClick={() => {
              redirectaddmodal(params);
            }}
          >
            {params.row.manufacturerName ? params.row.manufacturerName : "-"}
          </button>
        </div>
      ),
    },
    {
      field: "manufacturerDescription",
      headerAlign: "left",
      align: "left",
      headerName: "Manufacturer Discription",
      minWidth: 180,
      flex: 1,
      valueGetter: (params) => {
        return `${
          params.row.manufacturerDescription
            ? params.row.manufacturerDescription
            : "-"
        }`;
      },
    },
    {
      field: "isActive",
      headerName: "Active",
      headerAlign: "left",
      align: "left",
      type: "number",
      minWidth: 80,
      flex: 1,
      renderCell: (params) =>
        params.row.isActive ? <CheckIcon /> : <ClearIcon />,
    },
    {
      field: "actions",
      headerName: "Actions",
      className: "bg-dark",
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      minWidth: 200,
      flex: 1,
      position: "sticky",
      renderCell: (params) => (
        <div>
          {/* <button onClick={() => { editActionCall(params.row) }} className='myActionBtn m-1'> */}
          <button
            className="myActionBtn m-1"
            onClick={() => {
              // handleAdd();
              
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
          </button>

          <button
            className="myActionBtn m-1"
            onClick={() => {
              // editeStateModal(params.row);
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
          <button
            className="myActionBtn m-1"
            onClick={() => {
              // deleteStateAlert(params.row);
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
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="my-3  d-flex align-items-end justify-content-end">
        <div className="d-flex align-items-center" type="button">
          <h6 className="m-0 ps-1"></h6>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <li className="col-12 col-sm-4 col-md-4 d-flex align-items-center p-2">
              <main className="d-flex align-items-center">
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">
                  {rowData &&
                    rowData.length > 0 &&
                    rowData.map((val) => val.manufacturerName)}
                </span>
              </main>
            </li>
            <Button
              className="rounded-pill"
              variant="btn btn-warning mx-1"
              onClick={() => redirectaddmodal()}
            >
              BACK
            </Button>
          </div>
        </div>
        <div style={{ height: "40vh", width: "100%" }}>
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
              ...allMfacturerData.initialState,
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
        <section>
          <hr />
          <div className="mx-3 m-0">
            <h6 className="fw-bold myH9 m-0">Modal</h6>
          </div>
          <hr />
          <ul className="row m-0 px-2">
            <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  redirectaddmodal(rowData);
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">Modal List</span>
              </main>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
