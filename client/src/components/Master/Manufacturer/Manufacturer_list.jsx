import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  addManufacturerToDb,
  clearAddManufacturer,
} from "../../../redux/slices/Master/Manufacturer/addManufacturerSlice";
import { setShowMessage } from "../../../redux/slices/notificationSlice";
import { Modal, Button, Spinner } from "react-bootstrap";
import {
  getAllManufacturerAction,
  getManufacturerById,
  editeManufacturerAction,
  deleteManufacturerAction,
} from "./getEditeManufacturer";
import AlertDeleteModal from "../../AlertDelete/AlertDeleteModal";

export default function Manufacturer_list() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [allMfacturerData, setAllMfacturerData] = useState([]);
  const [editMaFacturerById, setEditMaFacturerById] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [loading, setLoading] = useState(false);

  //---- Delete Modal Variable -----//
  const [type, setType] = useState(null);
  const [id, setId] = useState(null);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const addmfacturer = useSelector(
    (state) => state.addManufacturerSlice.addManufacturer
  );

  //const { addManufacturerSlice } = useSelector(state => state.addManufacturerSlice)
  const [menufacturerData, Manufacturer] = useState({
    menufacturerName: "",
    menufacturerDiscription: "",
  });

  function onChangeHandler(e) {
    const name = e.target.name;
    const value = e.target.value;
    Manufacturer({ ...menufacturerData, [name]: value });
  }

  const handleClose = () => {
    setModalShow(false);
    clearInpHook();
  };
  const handleShow = () => {
    setModalShow(true);
  };
  function handleSubmit() {
    const mName = menufacturerData.menufacturerName;
    const mDiscr = menufacturerData.menufacturerDiscription;

    if (mName.length > 0 && mDiscr.length > 0) {
      if (editMaFacturerById != "") {
        menufacturerData["manufacturerId"] = editMaFacturerById;

        editeManufacturerAction(menufacturerData)
          .then((data) => {
            console.log("state Update getStateActionIdData:", data);
            if (data.result === "updatesuccess") {
              getAllManufacturerAction().then((data) => {
                setAllMfacturerData(data.result);
              });
              getAllManufacturerAction();
              setModalShow(false);
              clearInpHook();
              dispatch(
                setShowMessage("Manufacturer Data Update Successfully!")
              );
            } else {
              dispatch(setShowMessage("Something is wrong!"));
            }
          })
          .catch((error) => {
            console.error("Error in updateStateAction:", error);
          });
      } else {
        dispatch(addManufacturerToDb(menufacturerData));
      }
    } else {
      dispatch(setShowMessage("All Field Must be Required."));
    }
  }

  const editeStateModal = (ev) => {
    getManufacturerById(ev.manufacturerId)
      .then((data) => {
        Manufacturer({
          menufacturerName: data[0].manufacturerName,
          menufacturerDiscription: data[0].manufacturerDescription,
        });
        setEditMaFacturerById(data[0].manufacturerId);
        setModalShow(true);
      })
      .catch((error) => {
        console.error("Error in editStateAction:", error);
      });
  };
  const deleteStateAlert = (ev) => {
    //setModalShow(true);
    setType("manufacturer_delete");
    setId(ev.manufacturerId);
    setDeleteMessage(
      `Are You Sure You Want To Delete The Manufacturer '${ev.manufacturerName}'?`
    );
    setDisplayConfirmationModal(true);
  };

  // Hide the Deletemodal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };
  const submitDelete = (type, id) => {
    menufacturerData["manufacturerId"] = id;
    deleteManufacturerAction(menufacturerData)
      .then((data) => {
        if (data.result === "deletesuccess") {
          getAllManufacturerAction().then((data) => {
            setAllMfacturerData(data.result);
          });
          clearInpHook();
          setDisplayConfirmationModal(false);
          dispatch(setShowMessage("Manufacturer Data Delete Successfully!"));
        } else {
          dispatch(setShowMessage("Something is wrong!"));
        }
      })
      .catch((error) => {
        console.error("Error in DeleteStateAction:", error);
      });
  };

  useEffect(() => {
    if (addmfacturer.isSuccess) {
      if (addmfacturer.message.result === "success") {
        dispatch(setShowMessage("Manufacturer Save Successfully!"));
        getAllManufacturerAction()
          .then((data) => {
            setAllMfacturerData(data.result);
          })
          .catch((error) => {
            console.error("Error in getAllStateAction:", error);
          });
        clearInpHook();
        dispatch(clearAddManufacturer());
        setModalShow(false);
      } else if (addmfacturer.message.result === "alreadyExist") {
        dispatch(setShowMessage("Please Enter Other Manufacturer Name!"));
        dispatch(clearAddManufacturer());
      } else {
        dispatch(setShowMessage("Something is wrong!"));
      }
    }
  }, [addmfacturer]);

  function clearInpHook() {
    Manufacturer({
      menufacturerName: "",
      menufacturerDiscription: "",
    });
    setEditMaFacturerById("");
  }

  const redirectaddmodal = (rmdata) => {
    console.log(rmdata, "rmdata");
    navigate("/administration/configuration/manufacturer-modal", {
      state: { rowData: rmdata },
    });
  };

  // const columns = [
  //   {
  //     field: "rowNumber",
  //     headerAlign: "center",
  //     align: "center",
  //     headerName: "No",
  //     minWidth: 80,
  //     flex: 1,
  //   },
  //   {
  //     field: "manufacturerName",
  //     headerAlign: "center",
  //     align: "center",
  //     headerName: "Manufacturer Name",
  //     minWidth: 100,
  //     flex: 1,
  //     renderCell: (params) => (
  //       <div>
  //         <button
  //           className="mfacturerActionBtn"
  //           onClick={() => {
  //             redirectaddmodal(params);
  //           }}
  //         >
  //           {params.row.manufacturerName ? params.row.manufacturerName : "-"}
  //         </button>
  //       </div>
  //     ),
  //   },
  //   {
  //     field: "manufacturerDescription",
  //     headerAlign: "left",
  //     align: "left",
  //     headerName: "Manufacturer Discription",
  //     minWidth: 150,
  //     flex: 1,
  //     valueGetter: (params) => {
  //       return `${
  //         params.row.manufacturerDescription
  //           ? params.row.manufacturerDescription
  //           : "-"
  //       }`;
  //     },
  //   },
  //   {
  //     field: "isActive",
  //     headerName: "Active",
  //     headerAlign: "left",
  //     align: "left",
  //     type: "number",
  //     minWidth: 80,
  //     flex: 1,
  //     renderCell: (params) =>
  //       params.row.isActive ? <CheckIcon /> : <ClearIcon />,
  //   },
  //   {
  //     field: "actions",
  //     headerName: "Actions",
  //     className: "bg-dark",
  //     sortable: false,
  //     filterable: false,
  //     headerAlign: "center",
  //     align: "center",
  //     disableColumnMenu: true,
  //     minWidth: 200,
  //     flex: 1,
  //     position: "sticky",
  //     renderCell: (params) => (
  //       <div>
  //         {/* <button onClick={() => { editActionCall(params.row) }} className='myActionBtn m-1'> */}
  //         <button
  //           className="myActionBtn m-1"
  //           onClick={() => {
  //             editeStateModal(params.row);
  //           }}
  //         >
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             fill="currentColor"
  //             className="bi bi-pencil-square"
  //             viewBox="0 0 16 16"
  //           >
  //             <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
  //             <path
  //               fillRule="evenodd"
  //               d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
  //             />
  //           </svg>
  //         </button>
  //         <button
  //           className="myActionBtn m-1"
  //           onClick={() => {
  //             deleteStateAlert(params.row);
  //           }}
  //         >
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             fill="currentColor"
  //             className="bi bi-trash3"
  //             viewBox="0 0 16 16"
  //           >
  //             <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
  //           </svg>
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];
  const rowsData = allMfacturerData.map((item, index) => ({
    ...item,
    rowNumber: index + 1,
  }));

  useEffect(() => {
    setLoading(true)
    getAllManufacturerAction()
      .then((data) => {
        setAllMfacturerData(data.result);
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error in getAllStateAction:", error);
      });
  }, []);

  const redirectModal = () => {
    navigate(-1);
  };
  return (
    <>
      {/* <div className=''> */}
      {/* <NavLink to={/edit-user}>callme</NavLink > */}
      {/* <div className='my-3  d-flex align-items-end justify-content-end'>
                    <div className='d-flex align-items-center' type='button'>
                       
                        <h6 className='m-0 ps-1'>                           
                            <button type="button" className="btn btn-primary" onClick={handleShow}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>&nbsp;
                                Add Manufacturer
                            </button>
                        </h6>
                    </div>
                </div> */}

      {/*       
                <div style={{ height: '85vh', width: '100%' }}>
                    <DataGrid
                        rows={rowsData}
                        columns={columns}
                        getRowId={(params) => {
                            return params.rowNumber
                        }}
                        className='rounded'
                        style={{ fontFamily: 'Poppins', padding: 5, backgroundColor: 'white', }}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                             ...allMfacturerData.initialState,
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
                </div> */}
      {/* </div> */}

      {/* <AlertDeleteModal showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} type={type} id={id} message={deleteMessage}  /> */}
      {/* state modal */}
      <Modal show={modalShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <h5 className="modal-title" id="districtModalLabel">
            ADD MANUFACTURER
          </h5>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="mb-3">
              <label htmlFor="menufacturerName" className="col-form-label">
                Manufacturer Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="menufacturerName"
                name="menufacturerName"
                value={menufacturerData.menufacturerName}
                onChange={(e) => {
                  onChangeHandler(e);
                }}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="menufacturerDiscription"
                className="col-form-label"
              >
                Menufacturer Discription:
              </label>
              <textarea
                className="form-control"
                id="menufacturerDiscription"
                name="menufacturerDiscription"
                value={menufacturerData.menufacturerDiscription}
                onChange={(e) => {
                  onChangeHandler(e);
                }}
              ></textarea>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {" "}
            Close{" "}
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {" "}
            Save{" "}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* state modal end*/}
      <div className="master bg-white myBorder rounded">
        <div className="container">
          <div className="row mt-3">
            <div className="col-6">
              <h6 className="fw-bold m-0">Manufacturer List</h6>
            </div>
            <div className="col-6 d-flex align-items-end justify-content-end">
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
          </div>
        </div>

        <section>
          <hr />
          <div className="mx-3 m-0">
            <div className="d-flex align-items-end justify-content-between">
              <h6 className="fw-bold myH9 m-0 d-flex align-items-start justify-content-start">
                Manufacturer Name
              </h6>

              <div
                onClick={handleShow}
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
                <h6 className="m-0 ps-1">Manufacturer</h6>

              </div>
            </div>
          </div>

          <hr />
          <ul className="row m-0 px-2">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner style={{ color: 'rgb(132, 211, 227)' }} />
              </div>
            ) : (
              rowsData.map((row) => {
                return (
                  <ul className="row mb-2 px-2">
                    <li className="col-12 col-sm-4 col-md-4  d-flex align-items-center p-2">
                      <main
                        onClick={() => {
                          redirectaddmodal(row);
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
                        <span className="ms-2">{row.manufacturerName}</span>
                      </main>
                    </li>
                  </ul>
                );
              })
            )
            }
          </ul>
        </section>
      </div>
    </>
  );
}
