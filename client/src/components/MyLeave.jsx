
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import translations from '../assets/locals/translations';


const MyLeave = () => {
    const [showModal, setShowModal] = useState(false);
    const [leaveData, setLeaveData] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
        email: "",
    });
    const [validationMessage, setValidationMessage] = useState("");
    const [leaveList, setLeaveList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();
    const handleOpenDialog = () => {
        setShowModal(true);
    };
    const currentLanguage = useSelector((state) => state.language.language);
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const [language, setLanguage] = useState('en');
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    const leaveTypeData = [
        {
            id: 1,
            type: 'Casual Leave'
        },
        {
            id: 2,
            type: 'Leave Without Pay'
        }
    ]
    const handleCloseDialog = () => {
        setShowModal(false);
    };

    const leaveTypeMapping = {
        1: "Leave Without Pay",
        2: "Casual Pay",

    };


    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setLeaveData({
            ...leaveData,
            [name]: value,
        });
    };

    useEffect(() => {
        fetchLeaveList();
    }, []);


    async function fetchLeaveList() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_NODE_URL}/api/leave/getleaves`);
            if (response.data.isSuccess) {
                setLeaveList(response.data.result);
            } else {
                console.error('Error fetching leave data');
            }
        } catch (error) {
            console.error('Error fetching leave data: ' + error.message);
        }
    }


    const rowsWithLeaveType = leaveList.map((row) => ({
        ...row,
        LeaveType: leaveTypeMapping[row.LeaveType],
    }));


    const handleRowSelection = (selection) => {
        setSelectedRows(selection);
    };
    const checkboxColumn = {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        flex: 4,
    };

    const columns = [
        checkboxColumn,
        {
            field: "id",
            headerName: "ID",
            width: 100,
        },
        { field: "LeaveType", headerName: "Leave Type", width: 260 },
        {
            field: "StartDate",
            headerName: "Start Date",
            width: 200,
            valueFormatter: (params) => {
                const rawDate = new Date(params.value);
                const formattedDate = rawDate.toLocaleDateString();
                return formattedDate;
            },
        },

        {
            field: "EndDate",
            headerName: "End Date",
            width: 200,
            valueFormatter: (params) => {
                const rawDate = new Date(params.value);
                const formattedDate = rawDate.toLocaleDateString();
                return formattedDate;
            },
        },
        { field: "Reason", headerName: "Reason", width: 200 },
        { field: "Email", headerName: "Email", width: 200 },
    ];




    async function addLeave(leaveData) {
        const url = `${process.env.REACT_APP_NODE_URL}/api/leave/add-leave`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        try {
            const response = await axios.post(url, leaveData, config);
            if (response.data?.isSuccess) {
                if (response.data) {
                    console.log('Leave added successfully');
                    fetchLeaveList();
                    handleCloseDialog();
                }
            }
        } catch (error) {
            console.error('Error adding leave: ' + error.message);
        }
    }

    const handleSubmit = () => {
        if (
            leaveData.leaveType === "" ||
            leaveData.startDate === "" ||
            leaveData.endDate === "" ||
            leaveData.reason === "" ||
            leaveData.email === ""
        ) {
            setValidationMessage("All Fields are Required");
        } else {
            setValidationMessage("");
            addLeave(leaveData);
            setLeaveData({
                leaveType: "",
                startDate: "",
                endDate: "",
                reason: "",
                email: "",
            });
        }
    };


    return (

        <div>
            <div className="d-flex justify-content-end">
                {/* <Button
                    onClick={handleOpenDialog}
                    style={{ padding: '6px', margin: '2px', borderRadius: '20px', margin: '10px' }}
                >
                    <p>{translations[currentLanguage].addleave}</p>
                </Button> */}



                <div className='my-3  d-flex align-items-end justify-content-end'>
                    <div onClick={handleOpenDialog} className='d-flex align-items-center' type='button'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>
                        <h6 className='m-0 ps-1'>
                        <p>{translations[currentLanguage].addleave}</p>
                        </h6>
                    </div>
                </div>
                <Button
                    variant="btn btn-warning mx-1"
                    style={{
                        width: "70px",
                        height: "35px",
                        fontSize: "14px",
                        borderRadius: "20px",
                        margin: "10px",
                    }}
                    onClick={() => {
                        navigate("/management/manage");


                    }}
                >
                    <p>{translations[currentLanguage].back}</p>
                </Button>
            </div>
            <div style={{ position: "relative" }}>
                <DataGrid
                    rows={rowsWithLeaveType}
                    columns={columns}
                    components={{
                        Toolbar: () => (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <div style={{ marginRight: '16px' }}>
                                    <GridToolbar />
                                </div>
                            </div>
                        ),
                    }}
                    checkboxSelection
                    onSelectionModelChange={handleRowSelection}
                    style={{ backgroundColor: 'white' }}
                />

                <Modal show={showModal} onHide={handleCloseDialog}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Leave</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="leave-type" className="col-form-label">
                                    Leave Type:
                                </label>
                                <select
                                    className="form-select"
                                    id="leave-type"
                                    name="leaveType"
                                    value={leaveData.leaveType}
                                    onChange={(e) => onChangeHandler(e)}
                                >
                                    <option value="">Select Leave Type</option>
                                    {leaveTypeData && leaveTypeData.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="start-date" className="col-form-label">
                                    Start Date:
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="start-date"
                                    name="startDate"
                                    value={leaveData.startDate}
                                    onChange={(e) => onChangeHandler(e)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="end-date" className="col-form-label">
                                    End Date:
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="end-date"
                                    name="endDate"
                                    value={leaveData.endDate}
                                    onChange={(e) => onChangeHandler(e)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="reason" className="col-form-label">
                                    Reason:
                                </label>
                                <textarea
                                    className="form-control"
                                    id="reason"
                                    name="reason"
                                    value={leaveData.reason}
                                    onChange={(e) => onChangeHandler(e)}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="col-form-label">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={leaveData.email}
                                    onChange={(e) => onChangeHandler(e)}
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Apply
                        </Button>
                        <p style={{ color: "red" }}>{validationMessage}</p>
                    </Modal.Footer>
                </Modal>


            </div>
        </div>
    );
};

export default MyLeave;
