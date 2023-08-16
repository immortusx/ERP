import React, { useEffect, useState } from "react";
import Axios from "axios";


const Work_Assign_Area = () => {
    const [newEnquiryList, setNewEnquiryList] = useState({
        listDsp: [],

    });
    const [showComponent, setShowComponent] = useState(false);
    const currentBranch = localStorage.getItem("currentDealerId");

    useEffect(()=> {
        console.log(newEnquiryList,'user idi')
    
    })
    useEffect(() => {
        if (currentBranch) {
            async function getDspList() {
                const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-dsp_list1/${currentBranch}`;
                const config = {
                    headers: {
                        token: localStorage.getItem("rbacToken"),
                    },
                };

                await Axios.get(url, config).then((response) => {
                    if (response.data) {
                        if (response.data.isSuccess) {
                            console.log("response.data", response.data);
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



    return (
        <div className=" myBorder bg-white rounded p-3 height-85">
            <main>
                <div className="row mt-3 m-0 col-6 ">
                    <h5>Sales Person List</h5>
                </div>
                <div className="row">
                    <div className=" col-md-6">
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
                                        <div className="">
                                            <h7>{user.first_name} {user.last_name}</h7>
                                        </div>
                                        <div className="d-flex justify-content-end ">
                                            <h7>{user.village_list}</h7>
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

    );
}
export default Work_Assign_Area;