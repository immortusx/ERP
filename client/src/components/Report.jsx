import React from "react";
import { useNavigate } from "react-router-dom";

const Report = () => {
    const navigate = useNavigate();
    return (
        <div className="master bg-white myBorder rounded">
            <main className="my-3">
                <div className="mx-3 m-0">
                    <h6 className="fw-bold m-0">Work Assign </h6>
                </div>
                <section>
                    <hr />

                    <ul className="row m-0 px-2">
                        <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
                            <main
                                onClick={() => {
                                    navigate("/administration/report/Total_Enquiry");
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
                                <span className="ms-2">Total Enquiry</span>
                            </main>
                        </li>
                    </ul>
                    <hr />

                    <ul className="row m-0 px-2">
                        <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
                            <main
                                onClick={() => {
                                    navigate("/administration/report/Work_Assign_Area");
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
                                <span className="ms-2">Work Assigned Area</span>
                            </main>
                        </li>
                    </ul>
                </section>
            </main>
        </div>
    )
}
export default Report;