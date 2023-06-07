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
import { Modal, Button, Spinner } from "react-bootstrap";
import {
  getAllManufacturerAction,
  getManufacturerById,
  editeManufacturerAction,
  deleteManufacturerAction,
} from "./getEditeManufacturer";
import AlertDeleteModal from "../../AlertDelete/AlertDeleteModal";
import axios from "axios";

export default function Variants() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const autoFocusRef = useRef(null);

  const location = useLocation();
  const rowData = [location.state?.rowData];
  const [allMfacturerData, setAllMfacturerData] = useState([]);
  const [editMaFacturerById, setEditMaFacturerById] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [manufacturerID, setManufacturerID] = useState(0);
  const [loading, setLoading] = useState(false);
  const [variantList, setVariantList] = useState([]);
  const [modalId, setModalId] = useState(0);

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
    console.log(event.target.value);
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
        setModalId(val.id);
        setManufacturerID(val.manufacturerId);
      });
    }
  }, [rowData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const manufacturerNameData = rowData;
    const manufacturerModalVarData = modalRowsArr;
    console.log(manufacturerModalVarData, "var");

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

      if (modalId) {
        console.log(firstBlankFieldIndex, "blank");
        // All fields are filled, submit the data #manufacturerId
        console.log(manufacturerModalVarData, "varirantlist");
        console.log(manufacturerNameData, "row");

        const url = `${process.env.REACT_APP_NODE_URL}/api/master/addvariant`;
        const config = {
          headers: {
            token: localStorage.getItem("rbacToken"),
          },
        };
        const requestData = {
          manufacturerModalVarData: manufacturerModalVarData,
          modalid: modalId,
          manufacturerId: manufacturerID,
        };

        await axios.post(url, requestData, config).then((response) => {
          if (response.data && response.data.isSuccess) {
            redirectModal();
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

  const redirectModal = () => {
    navigate(-1);
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

  const getVariantList = async () => {
    console.log(modalId, "get");
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/getvariant/${modalId}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    setLoading(true);
    await axios.get(url, config).then((response) => {
      if (response.data && response.data.isSuccess) {
        console.log(response.data.result);
        setVariantList(response.data.result);
      }
      setLoading(false);
    });
  };
  useEffect(() => {
    if (manufacturerID !== 0) {
      getVariantList();
    }
  }, [manufacturerID]);

  const handleShow = () => {
    setModalShow(true);
  };
  const handleClose = () => {
    setModalShow(false);
  };

  const deleteModalAlert = () => {
    setDisplayConfirmationModal(true);
    setType("modal_delete");
    setId(modalId);
    setDeleteMessage(
      `Are You Sure You Want To Delete The Modal '${rowData.map(
        (val) => val.modalName
      )}'?`
    );
  };

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const submitDelete = async () => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/deletemodal`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    const requestData = {
      modalid: modalId,
      manufacturerId: manufacturerID,
    };

    await axios.post(url, requestData, config).then((response) => {
      if (response.data && response.data.isSuccess) {
        console.log(response.data.result)
        hideConfirmationModal();
        redirectModal();
        dispatch(setShowMessage("Modal Sucessfully Deleted."));
      }
    });
  };
  return (
    <>
      <div>
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <li className="col-10 col-sm-10 col-md-10 d-flex align-items-center p-2">
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
                      rowData.map((val) => val.modalName)}
                  </span>
                </main>
              </li>
              <div className="d-flex">
                <button
                  className="myActionBtn m-1"
                  onClick={() => {
                    deleteModalAlert();
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

                <Button
                  className="rounded-pill"
                  variant="btn btn-warning mx-1"
                  onClick={() => redirectModal()}
                >
                  BACK
                </Button>
              </div>
            </div>
          </div>

          <section className="d-flex  flex-column col-12 col-lg-5 mt-2">
            <label className="myLabel mx-4" htmlFor="email">
              Modal Name
            </label>
            {/* <select className='myInput' name="selectRole">
                                <option value='0' className='myLabel' selected>select role</option>
                                {
                                    showRolesList && showRolesList.length > 0 && showRolesList.map((item, index) => {
                                        return <option key={index} value={item.id}>{item.role}</option>
                                    })
                                }
                            </select> */}
            <input
              disabled
              className="myInput mx-4"
              name=""
              value={
                rowData &&
                rowData.length > 0 &&
                rowData.map((val) => val.modalName)
              }
            />
          </section>

          <section>
            <hr />
            <div className="mx-4 m-0">
              <div className="d-flex align-items-end justify-content-between">
                <h6 className="fw-bold myH9 m-0 d-flex align-items-start justify-content-start">
                  Variant List
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
                  <h6 className="m-0 ps-1">Add Variant</h6>
                </div>
              </div>
            </div>
            <div className="mx-4 m-0"></div>
            <hr />
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner style={{ color: "rgb(132, 211, 227)" }} />
              </div>
            ) : (
              variantList.map((row) => {
                return (
                  <div className="master">
                    <main className="my-0">
                      <ul className="row m-0 px-2">
                        <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
                          <main
                            // onClick={() => {
                            //   redirectToVariantScreen(row);
                            // }}
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
                            <span className="ms-2">{row.variantName}</span>
                          </main>
                        </li>
                      </ul>
                    </main>
                  </div>
                );
              })
            )}
          </section>
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
      <Modal show={modalShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <h5 className="modal-title" id="districtModalLabel">
            ADD MODAL
          </h5>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="my-3  d-flex align-items-end justify-content-end">
              <div className="d-flex align-items-center" type="button">
                <h6 className="m-0 ps-1"></h6>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="d-flex">
                  <label className="form-label">Modal Name:</label>
                  <p className="px-4">
                    {rowData &&
                      rowData.length > 0 &&
                      rowData.map((val) => val.modalName)}
                  </p>
                </div>
              </div>
              <div className="card-body">
                {modalRowsArr.length > 0 &&
                  modalRowsArr.map((modalRow, modalIndex) => (
                    <div className="row" key={`ModaleNumber_${modalIndex}`}>
                      <div className="col-12">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                          Variant Name:
                        </label>
                        {modalRow.variants.map((variantRow, variantIndex) => (
                          <div
                            className="row mb-2"
                            key={`VariantNumber_${variantIndex}`}
                          >
                            <div className="col-10">
                              <input
                                type="text"
                                className={`form-control ${
                                  firstBlankField === modalIndex
                                    ? "is-invalid"
                                    : "was-validated"
                                }`}
                                id={`variantName_${modalIndex}_${variantIndex}`}
                                name={`variantName_${modalIndex}_${variantIndex}`}
                                value={variantRow.variantName}
                                onChange={(event) =>
                                  onVariantNameChange(
                                    event,
                                    modalIndex,
                                    variantIndex
                                  )
                                }
                                ref={
                                  firstBlankField === modalIndex
                                    ? autoFocusRef
                                    : null
                                }
                              />
                            </div>
                            <div className="col-2">
                              {modalRow.variants.length === variantIndex + 1 ? (
                                <Button
                                  variant="primary rounded-circle"
                                  onClick={() =>
                                    onAddNewVariantHandler(modalIndex)
                                  }
                                >
                                  +
                                </Button>
                              ) : (
                                <Button
                                  variant="danger rounded-circle"
                                  onClick={() =>
                                    onRemoveVariantHandler(
                                      modalRow.id,
                                      variantIndex
                                    )
                                  }
                                >
                                  -
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="card-footer">
                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    variant="btn btn-warning mx-1"
                    onClick={() => {
                      redirectModal();
                    }}
                  >
                    CANCEL
                  </Button>
                  <Button variant="btn btn-success mx-1" onClick={handleSubmit}>
                    SAVE
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {" "}
            Close{" "}
          </Button>
        </Modal.Footer>
      </Modal>
    </>

    // <div>
    //   <div className="my-3  d-flex align-items-end justify-content-end">
    //     <div className="d-flex align-items-center" type="button">
    //       <h6 className="m-0 ps-1"></h6>
    //     </div>
    //   </div>
    //   <div className="card">
    //     <div className="card-header">
    //       <div className="d-flex">
    //         <label className="form-label">Manufacturer Name:</label>
    //         <p className="px-4">{rowData && rowData.length > 0 && rowData.map((val)=> val.manufacturerName)}</p>
    //       </div>
    //     </div>
    //     <div className="card-body">
    //       {modalRowsArr.length > 0 &&
    //         modalRowsArr.map((modalRow, modalIndex) => (
    //           <div className="row" key={`ModaleNumber_${modalIndex}`}>
    //             <div className="col-6">
    //               <label className="form-label">Modal Name:</label>
    //               <div className="row">
    //                 <div className="col-10">
    //                   <input
    //                     type="text"
    //                     className={`form-control ${
    //                       firstBlankField === modalIndex
    //                         ? "is-invalid"
    //                         : "was-validated"
    //                     }`}
    //                     id={`modalName_${modalIndex}`}
    //                     name={`modalName_${modalIndex}`}
    //                     value={modalRow.modalName}
    //                     onChange={(event) =>
    //                       onModalNameChange(event, modalIndex)
    //                     }
    //                     ref={
    //                       firstBlankField === modalIndex ? autoFocusRef : null
    //                     }
    //                   />
    //                 </div>
    //                 <div className="col-2">
    //                   {modalRowsArr.length === modalIndex + 1 ? (
    //                     <Button
    //                       variant="primary rounded-circle"
    //                       onClick={() => onAddNewRowsHandler(modalIndex)}
    //                     >
    //                       +
    //                     </Button>
    //                   ) : (
    //                     <Button
    //                       variant="danger rounded-circle"
    //                       onClick={() => onRemoveModalHandler(modalRow.id)}
    //                     >
    //                       -
    //                     </Button>
    //                   )}
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-6">
    //               <label
    //                 htmlFor="exampleFormControlInput1"
    //                 className="form-label"
    //               >
    //                 Variant Name:
    //               </label>
    //               {modalRow.variants.map((variantRow, variantIndex) => (
    //                 <div
    //                   className="row mb-2"
    //                   key={`VariantNumber_${variantIndex}`}
    //                 >
    //                   <div className="col-10">
    //                     <input
    //                       type="text"
    //                       className={`form-control ${
    //                         firstBlankField === modalIndex
    //                           ? "is-invalid"
    //                           : "was-validated"
    //                       }`}
    //                       id={`variantName_${modalIndex}_${variantIndex}`}
    //                       name={`variantName_${modalIndex}_${variantIndex}`}
    //                       value={variantRow.variantName}
    //                       onChange={(event) =>
    //                         onVariantNameChange(event, modalIndex, variantIndex)
    //                       }
    //                       ref={
    //                         firstBlankField === modalIndex ? autoFocusRef : null
    //                       }
    //                     />
    //                   </div>
    //                   <div className="col-2">
    //                     {modalRow.variants.length === variantIndex + 1 ? (
    //                       <Button
    //                         variant="primary rounded-circle"
    //                         onClick={() => onAddNewVariantHandler(modalIndex)}
    //                       >
    //                         +
    //                       </Button>
    //                     ) : (
    //                       <Button
    //                         variant="danger rounded-circle"
    //                         onClick={() =>
    //                           onRemoveVariantHandler(modalRow.id, variantIndex)
    //                         }
    //                       >
    //                         -
    //                       </Button>
    //                     )}
    //                   </div>
    //                 </div>
    //               ))}
    //             </div>
    //           </div>
    //         ))}
    //     </div>
    //     <div className="card-footer">
    //       <div className="d-flex align-items-center justify-content-center">
    //         <Button
    //           variant="btn btn-warning mx-1"
    //           onClick={() => {
    //             redirectaddmodal(rowData);
    //           }}
    //         >
    //           CANCEL
    //         </Button>
    //         <Button variant="btn btn-success mx-1" onClick={handleSubmit}>
    //           SAVE
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
