import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { setShowMessage } from "../../../redux/slices/notificationSlice";
import { addEnquirySourcesToDb, clearAddEnquirySources } from "../../../redux/slices/Master/EnquirySources/addEnquirySourcesSlice";

const EnquirySources = ({workFor}) => {
    const [modalShow, setModalShow] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [rowsData, setRowData] = useState([]);
    const currentBranch = localStorage.getItem("currentDealerId");
    const [enquirySource, setEnquirySource] = useState([]);
    const addEnquirySourcesState = useSelector((state) => state.addEnquirySourcesSlice.addEnquirySourcesState
    );

    const [enquirySourcesData, setEnquirySourcesData] = useState({
        enquirySourcesName: "",
        enquirySourcesDescription: "",
    });

    const redirectModal = () => {
        navigate(-1);
    };

    const handleClose = () => {
        setModalShow(false);
    };

    const handleShow = () => {
        setModalShow(true);
    };


    const getAllEnquirySource = async () => {
            const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-primary-source`;
            const config = {
                headers: {
                    token: localStorage.getItem('rbacToken')
                }
            };

            try {
                const response = await Axios.get(url, config);
                if (response.data?.isSuccess) {
                    console.log(response.data.result, "all satehhhhhhhhhhhhh");
                    setRowData(response.data.result); // Update the rowsData state
                }
            } catch (error) {
                console.error(error);
            }
        
    };

    useEffect(() => {
        // Call the function to fetch enquiry sources data when the component mounts
        getAllEnquirySource();
    },[]);

    const handleSubmit = async () => {
        if (enquirySourcesData.enquirySourcesName.trim() === "" || enquirySourcesData.enquirySourcesDescription.trim() === "") {
            // Display validation error message to the user
            return;
        }
        if (workFor === "forAddd") {
          dispatch(addEnquirySourcesToDb(enquirySourcesData));
        } else {
          dispatch(setShowMessage("All fields must be filled"));
        }
      }
    useEffect(() => {
        if (addEnquirySourcesState.isSuccess) {
          if (addEnquirySourcesState.message.isSuccess) {
            dispatch(setShowMessage("Data Updated"));
            getAllEnquirySource()
            .then((data) => {
                setEnquirySourcesData(data.result);
            })
            dispatch(clearAddEnquirySources())
            clearAddEnquirySources();
            setModalShow(false);
          } else {
            dispatch(setShowMessage("Something is wrong"));
          }
        }
    }, [addEnquirySourcesState]);

    const redirectaddmodal = (enquirySource) => {
        navigate("/administration/configuration/enquirysources-model", {
            state: { enquirySource: enquirySource },
        });
    };

    return (
        <>
            <Modal show={modalShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <h5 className="modal-title" id="districtModalLabel">
                        ADD Enquiry Primary Source
                    </h5>
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        <div className="mb-3">
                            <label htmlFor="enquirySourcesName" className="col-form-label">
                                Enquiry Primary Source Name:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="enquirySourcesName"
                                name="enquirySourcesName"
                                value={enquirySourcesData.enquirySourcesName}
                                onChange={(e) => {
                                    setEnquirySourcesData({ ...enquirySourcesData, enquirySourcesName: e.target.value });
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="enquirySourcesDescription" className="col-form-label">
                                Enquiry Primary Source Description:
                            </label>
                            <textarea
                                className="form-control"
                                id="enquirySourcesDescription"
                                name="enquirySourcesDescription"
                                value={enquirySourcesData.enquirySourcesDescription}
                                onChange={(e) => {
                                    setEnquirySourcesData({ ...enquirySourcesData, enquirySourcesDescription: e.target.value });
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
                            <h6 className="fw-bold m-0">Enquiry Sources List</h6>
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
                                Enquiry Primary Sources Name
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
                            rowsData.map((row) => (
                                <ul key={row.id} className="row mb-2 px-2">
                                    <li className="col-12 col-sm-4 col-md-4  d-flex align-items-center p-2">
                                        <main onClick={() => {
                                            redirectaddmodal(row);
                                        }} className="d-flex align-items-center">
                                            <div className="myBtnRight">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    className="bi bi-chevron-double-right"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                                                    />
                                                </svg>
                                            </div>
                                            <span className="ms-2">{row.name}</span>
                                        </main>
                                    </li>
                                </ul>
                            ))
                        )}
                    </ul>
                </section>
            </div>
        </>
    );
};

export default EnquirySources;
