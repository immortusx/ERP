import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Modal, Button } from "react-bootstrap";
import {useNavigate } from "react-router-dom";
const WorkAssign = () => {
    const navigate = useNavigate();
    const [newEnquiryList, setNewEnquiryList] = useState({
        listDsp: [],

    });
    const [showComponent, setShowComponent] = useState(false);
    const currentBranch = localStorage.getItem("currentDealerId");
    useEffect(() => {
        if (currentBranch) {
            async function getDspList() {
                const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-dsp_enquerylist/${currentBranch}`;
                const config = {
                    headers: {
                        token: localStorage.getItem("rbacToken"),
                    },
                };

                await Axios.get(url, config).then((response) => {
                    if (response.data) {
                        if (response.data.isSuccess) {
                            setNewEnquiryList((newEnquiryList) => ({
                                ...newEnquiryList,
                                ["listDsp"]: response.data.result,
                            }));

                        }
                    }
                });
            }
            getDspList();
        }
    }, [currentBranch])
    const redirectModal = () => {
        navigate(-1);
    };



    return (
        <>
            <div className="my-3  d-flex align-items-end justify-content-end">
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
            <div className="editUser myBorder bg-white rounded p-3 height-85">
                <main>
                    <div className="row mt-3 m-0 col-6 ">
                        <h5>Sales Person List</h5>
                    </div>
                    <div className="row">
                        <div className="userd2 col-md-6">
                            <div class="panel">


                                {newEnquiryList.listDsp.map((user) => (
                                    <div
                                        key={user.id}
                                        style={{
                                            backgroundColor: "#fdfff5",
                                            padding: "10px",
                                            border: "1px solid #ccc",
                                            borderRadius: "8px",
                                            margin: "10px 0",
                                        }}
                                    >
                                        <div className="row">
                                            <div className="col-md-6 salpid1">
                                                <h7>{user.first_name} {user.last_name}</h7>
                                            </div>
                                            <div className="col-md-6 d-flex justify-content-end salpid">
                                                <h7>{user.totalenquery}</h7>
                                            </div>

                                        </div>
                                        {/* <p className="d-flex">
                                        <span className="salpid1">{user.first_name}</span>
                                        <span className="salpid">{user.id}</span>
                                    </p> */}

                                    </div>

                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
export default WorkAssign;