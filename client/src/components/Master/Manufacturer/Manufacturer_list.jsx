import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios, { Axios } from "axios";
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
  const [file, setFile] = useState(null);
  const [allMfacturerData, setAllMfacturerData] = useState([]);
  const [editMaFacturerById, setEditMaFacturerById] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [insertedId, setInsertedId] = useState([]);
  //---- Delete Modal Variable -----//
  const [type, setType] = useState(null);
  const [id, setId] = useState(null);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const addmfacturer = useSelector(
    (state) => state.addManufacturerSlice.addManufacturer
  );
  const [documentId, setDocumentId] = useState("");
  //const { addManufacturerSlice } = useSelector(state => state.addManufacturerSlice)
  const [menufacturerData, Manufacturer] = useState({
    menufacturerName: "",
    menufacturerDiscription: "",
    menufacturerLink: "",
  });

  function onChangeHandler(e) {
    const name = e.target.name;
    const value = e.target.value;
    Manufacturer((prevData) => ({ ...prevData, [name]: value }));

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
    const mLink = menufacturerData.menufacturerLink;

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
        const formData = new FormData();
        formData.append("file", file);
        formData.append("menufacturerName", mName);
        formData.append("menufacturerDiscription", mDiscr);
        formData.append("menufacturerLink", mLink)
        formData.append("insertedId", insertedId);
        formData.append("documentId", documentId);
        dispatch(addManufacturerToDb(formData));
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
    navigate("/administration/configuration/manufacturer-modal", {
      state: { rowData: rmdata },
    });
  };
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  useEffect(() => {
    if (file && menufacturerData.menufacturerLink !== null) {
      const uploadDocument = async () => {
        const url = `${process.env.REACT_APP_NODE_URL}/api/employees/upload-document`;
        const config = {
          headers: {
            token: localStorage.getItem("rbacToken"),
          },
        };
        const formData = new FormData();
        formData.append('document', file);
        formData.append("link", menufacturerData.menufacturerLink)
        try {
          await axios.post(url, formData, config).then((response) => {
            if (response.data) {
              setInsertedId([...insertedId, response.data.result.insertId]);
              setDocumentId(response.data.result.insertId);
            }
          })

        } catch (error) {
          console.error("Error uploading document:", error);
        }
      }
      uploadDocument();
    }
  }, [file]);

  return (
    <>
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

            <div className="mb-3">
              <label htmlFor="file" className="col-form-label">
                Manufacturer Link:
              </label>
              <input
                type="menufacturerLink"
                className="form-control"
                id="menufacturerLink"
                name="menufacturerLink"
                onChange={onChangeHandler}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="file" className="col-form-label">
                Manufacturer File:
              </label>
              <input
                type="file"
                className="form-control"
                id="file"
                name="file"
                onChange={handleFileChange}
              />
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
                <h6 className="m-0 ps-1">Add</h6>

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
