
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Axios from "axios";
import { useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import translations from '../assets/locals/translations';
import { color } from "@mui/system";

const MyLeave = () => {
    const [showModal, setShowModal] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [leaveTypeData, setLeaveTypeData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [leaveData, setLeaveData] = useState({
        leaveTypes: "",
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

    const handleCloseDialog = () => {
        setShowModal(false);
    };


    const [leaveType, setLeaveType] = useState({
        listLeaveType: [],
    });
    const onChangeLeaveType = (e) => {
        setLeaveData({
            ...leaveData,
            leaveTypes: e.target.value,
        });
    }
    async function getlistLeaveType() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/leave/get-leave-type-list`;
        const config = {
            headers: {
                token: localStorage.getItem("rbacToken"),
            },
        };
        await Axios.get(url, config).then((response) => {
            if (response.data) {
                if (response.data.result) {
                    console.log(response.data.result, 'd;fedg')
                    setLeaveType((leaveType) => ({
                        ...leaveType,
                        ["listLeaveType"]: response.data.result,
                    }));
                }
            }
        });
    }
    useEffect(() => {
        getlistLeaveType();
    }, [])
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setLeaveData({
            ...leaveData,
            [name]: value,
        });
    };

    async function fetchLeaveList() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/leave/get-leave-details`;
        const config = {
            headers: {
                token: localStorage.getItem("rbacToken"),
            },
        };

        const response = await Axios.get(url, config);
        if (response.data && response.data.isSuccess) {
            const formattedData = response.data.result.map((leave, index) => ({
                leaveid: leave.leaveid,
                userName: leave.userName,
                LeaveType: leave.LeaveType,
                startDate: leave.startDate,
                endDate: leave.endDate,
                reason: leave.reason,
                email: leave.email,
            }));

            setLeaveTypeData(formattedData);
        }
    }
    useEffect(() => {
        fetchLeaveList();
    }, []);

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
        { field: "userName", headerName: translations[currentLanguage].username, width: 260 },

        { field: "LeaveType", headerName: translations[currentLanguage].leavetype, width: 260 },
        {
            field: "startDate",
            headerName: translations[currentLanguage].startd,
            width: 200,
            valueFormatter: (params) => {
                const rawDate = new Date(params.value);
                const formattedDate = rawDate.toLocaleDateString();
                return formattedDate;
            },
        },

        {
            field: "endDate",
            headerName: translations[currentLanguage].endd,
            width: 200,
            valueFormatter: (params) => {
                const rawDate = new Date(params.value);
                const formattedDate = rawDate.toLocaleDateString();
                return formattedDate;
            },
        },
        { field: "reason", headerName: translations[currentLanguage].reason, width: 200 },
        { field: "email", headerName: translations[currentLanguage].email, width: 200 },
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
        console.log(leaveData.leaveTypes, "dsdsfhdfhdfhdsfdhfsgd")
        addLeave(leaveData);
        setLeaveData({
            leaveTypes: "",
            startDate: "",
            endDate: "",
            reason: "",
            email: "",
        });
        fetchLeaveList();
    };

    useEffect(() => {
        // Update the rowData state with the leaveList
        setRowData(leaveList);
    }, [leaveList]);
    useEffect(() => {
        const rowsData = leaveTypeData.map((item, index) => ({
            ...item,
            id: index + 1,
            // id: item.id,
            checkbox: selectAll,
        }));
        setRowData(rowsData);
    }, [leaveTypeData, selectAll]);
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
                    rows={rowData}
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
                        <Modal.Title > {translations[currentLanguage].addleave}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="leave-type" className="col-form-label " style={{ fontWeight: 'bold' }}>
                                {translations[currentLanguage].leavetype}:
                                </label>
                                <select onChange={onChangeHandler} className="form-control" name="leaveTypes" value={leaveData.leaveTypes}>
                                    <option value="">Select Leave Type</option>
                                    {leaveType.listLeaveType &&
                                        leaveType.listLeaveType.length > 0 &&
                                        leaveType.listLeaveType.map((i) => {
                                            const leavetype = `${i.leave_type}`;
                                            return (
                                                <option
                                                    key={i.id}
                                                    value={i.id}
                                                    className="myLabel"
                                                >
                                                    {leavetype}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="start-date" className="col-form-label" style={{ fontWeight: 'bold' }}>
                                {translations[currentLanguage].startd}:
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
                                <label htmlFor="end-date" className="col-form-label" style={{ fontWeight: 'bold' }}>
                                {translations[currentLanguage].endd}:
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
                                <label htmlFor="reason" className="col-form-label" style={{ fontWeight: 'bold' }}>
                                {translations[currentLanguage].reason}:
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
                                <label htmlFor="email" className="col-form-label" style={{ fontWeight: 'bold' }}>
                                {translations[currentLanguage].email}:
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
                        {translations[currentLanguage].cancel}
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                        {translations[currentLanguage].apply}
                        </Button>
                        <p style={{ color: "red" }}>{validationMessage}</p>
                    </Modal.Footer>
                </Modal>


            </div>
        </div>
    );
};

export default MyLeave;
