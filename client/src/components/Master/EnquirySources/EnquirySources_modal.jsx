import React, { useState, useEffect, useMemo, useRef } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import AlertDeleteModal from "../../AlertDelete/AlertDeleteModal";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setShowMessage } from "../../../redux/slices/notificationSlice";


export default function EnquirySources_model() {
    const navigate = useNavigate();
    const location = useLocation();
    const enquirySource = location.state.enquirySource;
    const [modalShow, setModalShow] = useState(false);
    const dispatch = useDispatch();
    const [enquirySourcesType,setEnquirySourcesType]= useState(null);
    const [loading, setLoading] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [esourceList, setEsourceList] = useState([]);
    const [sourcesName, setSourcesName] = useState("");
    const [sourceRowsArr, setSourceRowsArr] = useState([]);
    const [enquirySourceId, setEnquirySourceId] = useState(null);
    const [primarySourcesId, setPrimaryId] = useState(0);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
      };
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [enquirySourceData, setEnqurySourceData] = useState({
        id: null,
        name: "",
        description: ""
    })
    const handleShow = () => {
        setModalShow(true);
    };
    const handleClose = () => {
        setModalShow(false);
    };
    const onChangeHandler = (e) => {
        console.log(e.target.value);
        setSourcesName(e.target.value);
    };

    const onAddNewRowsHandlers = () => {
        setSourceRowsArr((prevState) => [
            ...prevState,
            {
                id: new Date().getTime(),
                eSourceName: "",
            },
        ]);
    };
    useEffect(() => {
        onAddNewRowsHandlers();
    }, []);
    useEffect(() => {
        if (rowData) {
            rowData.map((val) => {
                setPrimaryId(val.primary_source_id);

            });
        }
    }, [rowData]);
    useEffect(() => {
        if (enquirySource) {
            setEnqurySourceData({
                id: enquirySource.id,
                name: enquirySource.name,
                description: enquirySource.description
            });

        }
    }, [enquirySource])
    const getAllEnquirySource = async () => {
        const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-source-enquiry/${enquirySourceData.id}`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };

        try {
            const response = await Axios.get(url, config);
            if (response.data?.isSuccess) {
                console.log(response.data.result, "all satehhhhhhhhhhhhh");
                setRowData(response.data.result);
                setEsourceList(response.data.result);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (enquirySourceData.id) {
            getAllEnquirySource();
        }

    }, [enquirySourceData.id]);
    const handleModalSubmit = async (e) => {
        const eSourcesNameData = rowData;
        const eSourcesData = sourceRowsArr;
        // console.log(manufacturerModalData);
        // console.log(manufacturerID);

        const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/addenquirysources`;
        const config = {
            headers: {
                token: localStorage.getItem("rbacToken"),
            },
        };
        const requestData = {
            sourcesName: sourcesName,
            primarySourcesId: enquirySourceData.id,
        };
        await axios.post(url, requestData, config).then((response) => {
            if (response.data && response.data.isSuccess) {
                handleClose();
                getAllEnquirySource();
                dispatch(setShowMessage("Data Successfully Saved."));
            }
        });
    };
    const deleteEnquirySourcesAlert = () => {
        setDisplayConfirmationModal(true);
        setEnquirySourcesType("enquirysources_delete");
        setEnquirySourceId(primarySourcesId);
        setDeleteMessage(
          `Are You Sure You Want To Delete The Enquiry Sources '${enquirySourceData.name}'?`
        );
      };

    const submitDelete = async () => {
        const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/deletenquirysources`;
        const config = {
          headers: {
            token: localStorage.getItem("rbacToken"),
          },
        };
        const requestData = {
            primarySourcesId: enquirySourceData.id,
        };
    
        await axios.post(url, requestData, config).then((response) => {
          if (response.data && response.data.isSuccess) {
            console.log(response.data.result)
            hideConfirmationModal();
            navigate("/administration/configuration/enquirysources")
            dispatch(setShowMessage("Enquiry Sources Sucessfully Deleted."));
          }
        });
      };
    const redirectEnquirySources = () => {
        navigate(-1);
    };
    return (
        <>
            <div>
                <div className="card">
                    <div className="card-header">
                        <div className="row align-items-center">
                            <div className="col-10 col-md-10 col-sm-10">
                                <div className="d-flex align-items-center">
                                    <li className="d-flex align-items-center p-2">
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
                                                {enquirySourceData.name}
                                            </span>
                                        </main>
                                    </li>
                                </div>
                            </div>
                            <div className="col-2 col-md-2 col-sm-2">
                                <div className="d-flex justify-content-end">
                                    <button 
                                        className="myActionBtn m-1"
                                    onClick={() => { deleteEnquirySourcesAlert() }}
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
                                        variant="btn btn-warning mx-1"
                                        style={{ width: '70px', height: '35px', fontSize: '14px', borderRadius: '20px' }}
                                        onClick={() => {
                                            redirectEnquirySources();
                                        }}
                                    >
                                        BACK
                                    </Button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <section className="d-flex  flex-column col-12 col-lg-5 mt-2">
                        <label className="myLabel mx-4" htmlFor="email">
                            Enquiry Primary Source Name:
                        </label>

                        <input
                            disabled
                            className="myInput mx-4"
                            name=""
                            value={enquirySourceData.name}
                        />
                    </section>
                    <section className="d-flex mt-3 flex-column col-12">
                        <label className="myLabel mx-4" htmlFor="email">
                            Description
                        </label>
                        <textarea
                            disabled
                            rows="5"
                            value={enquirySourceData.description}
                            className="myInput inputElement mx-4"
                            autoComplete="false"
                            onChange={(e) => { onChangeHandler(e) }}
                            type="text"
                            name="eDescription"
                        />
                    </section>
                    <section>
                        <hr />
                        <div className="mx-4 m-0">
                            <div className="d-flex align-items-end justify-content-between">
                                <h6 className="fw-bold myH9 m-0 d-flex align-items-start justify-content-start">
                                    Enquiry Sources List
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
                            esourceList.map((row) => {
                                return (
                                    <div className="master">
                                        <main className="my-0">
                                            <ul className="row m-0 px-2">
                                                <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
                                                    <main
                                                        // onClick={() => {
                                                        //     redirectToVariantScreen(row);
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
                                                        <span className="ms-2">{row.name}</span>
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
                type={enquirySourcesType}
                id={enquirySourceId}
                message={deleteMessage}
            />
            <Modal show={modalShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <h5 className="modal-title" id="districtModalLabel">
                        ADD ENQUIRY SOURCES
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
                                    <label className="form-label">Primary Enquiry Sources Name:</label>
                                    <p className="px-4">
                                        {enquirySourceData.name}
                                    </p>
                                </div>
                            </div>
                            <div className="card-body">

                                <div className="">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="menufacturerName"
                                            className="col-form-label"
                                        >
                                            Enquiry Sources Name:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="enquirySourcesName"
                                            name="enquirySourcesName"
                                            //value={menufacturerData.menufacturerName}
                                            onChange={(e) => {
                                                onChangeHandler(e);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex align-items-center justify-content-center">
                                    <Button
                                        variant="btn btn-warning mx-1"
                                    // onClick={() => {
                                    //     redirectManufacurer();
                                    // }}
                                    >
                                        CANCEL
                                    </Button>
                                    <Button
                                        variant="btn btn-success mx-1"
                                        onClick={handleModalSubmit}
                                    >
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
    );
}