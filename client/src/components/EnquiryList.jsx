import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserListFromDb,
  clearUserListState,
} from "../redux/slices/getUserListSlice";
import { setEditUserData } from "../redux/slices/editUserDataSlice";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Axios from "axios";
import axios from "axios";
import moment from "moment";
import AlertDeleteModal from "./AlertDelete/AlertDeleteModal";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PersonIcon from "@mui/icons-material/Person";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";

import "../styles/Users.css";
import translations from "../assets/locals/translations";
import Checkbox from "@mui/material/Checkbox";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { setShowMessage } from "../redux/slices/notificationSlice";
export { getUserListFromDb };

export default function EnquiryList() {
  const dispatch = useDispatch();
  const [enquiries, setEnquiries] = useState([]);
  const [showComponent, setShowComponent] = useState(false);
  const [customerId, setCustomerId] = useState([]);
  const [enquiryId, setEnquiryId] = useState(null);
  const [selecteduser, setSelectedUser] = useState({});
  const [csvFile, setCsvFile] = useState("No File Selected");
  const [id, setId] = useState(null);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [type, setType] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [newEnquiryList, setNewEnquiryList] = useState({
    listDsp: [],
  });
  const [newEnquiryData, setNewEnquiryData] = useState({
    dsp: "",
  });
  const [selectedPerson, setSelectedPerson] = useState([]);
  const navigate = useNavigate();
  const currentBranch = localStorage.getItem("currentDealerId");
  console.log(currentBranch, "currentBranch*******");

  function editActionCall() {}
  const fileInputRef = useRef(null);
  function onChangeCSVFile(e) {
    const file = e.target.files[0];
    if (file) {
      console.log(file, "csv file");
      setCsvFile(file);
    } else {
      setCsvFile("No file selected");
    }
    // const name = e.target.name;
    // const files = e.target.files;
    // setEmployeeProfilelogo({ ...employeeData, [name]: files[0] });
    // console.log(employeeData, "employeeData");
  }
  const handleCSVUpload = async () => {
    console.log(csvFile, "csdielf");
    const url = `${process.env.REACT_APP_NODE_URL}/api/upload-csv`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    const formData = new FormData();
    formData.append("enquiryCSV", csvFile);
    try {
      const response = await Axios.post(url, formData, config);
      if (response.data) {
        // setDocumentId(response.data.result.insertId);
        console.log(response.data.result, "CVEROTE");
      }
    } catch (error) {
      // Handle any errors here
      console.error("Error uploading CSV:", error);
    }
  };
  const [selectAll, setSelectAll] = useState(false);
  const [rowData, setRowData] = useState([]);

  const handleHeaderCheckboxClick = () => {
    setSelectAll(!selectAll);
  };

  const currentLanguage = useSelector((state) => state.language.language);

  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const handleChildCheckboxClick = (itemId) => {
    console.log(itemId, "itemId");
    const updatedRowsData = rowData.map((row) => {
      if (row.id === itemId) {
        return {
          ...row,
          checkbox: !row.checkbox,
        };
      }
      return row;
    });
    setRowData(updatedRowsData);

    // Update selected items array
    const updatedSelectedItems = updatedRowsData
      .filter((row) => row.checkbox)
      .map((row) => row.id);
    console.log(updatedSelectedItems, "updatedSelectedItems");
    setSelectedItemIds(updatedSelectedItems);
  };

  function handleworkAssign(data, isChecked) {
    console.log("&&&&&&&&&&&&&&77 data", data);
    console.log("&&&&&&&&&&&&&&77 isChecked", isChecked);
    let ids = "";
    let selectedRowsData = [];
    if (isChecked) {
      ids = data.id;
      console.log(ids, "idss");
    } else {
      selectedRowsData = rowData.filter((row) =>
        selectedItemIds.includes(row.id)
      );

      console.log("evdata**********", selectedRowsData);
      ids = selectedRowsData.map((item) => item.id);
      console.log(ids, "idss");
    }
    try {
      setCustomerId(ids);
      setSelectedUser(selectedRowsData.sales_person);
      const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-multiple-enquiriesbyId/${ids}`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };

      const response = Axios.get(url, config);
      console.log(response.data, "data!!!!!!!!!!!");
      getDspList(currentBranch);
      setShowComponent(true);

      if (response.data && response.data.isSuccess) {
        const resultData = response.data.result;
        console.log("Result Data:", resultData);
        resultData.forEach((enquiry) => {
          console.log("Enquiry ID:", enquiry.salesperson_id);

          setSelectedPerson(enquiry);
        });
      } else {
        console.log(
          "No data received from the server or the request was not successful."
        );
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  }
  const editEnquiryCell = (editEnquiryData) => {
    console.log(editEnquiryData, "editEnquiryData");
    const customerId = editEnquiryData.id;
    navigate("/sale/enquiries/editenquiry", { state: customerId });
  };

  const handleFolloup = (editEnquiryData) => {
    console.log(editEnquiryData, "editEnquiryData");
    navigate("/sale/enquiries/followup", { state: editEnquiryData });
  };
  async function editsalesperson(formData) {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/edit-salesperson-enquiry-data`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.post(url, formData, config).then((response) => {
      if (response.data) {
        if (response.data && response.data.isSuccess) {
          console.log(response.data.result, "result**********");
          setNewEnquiryData(response.data.result);
        }
      }
    });
  }
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const hideModal = () => {
    setShowComponent(false);
  };

  async function getDspList(currentBranch) {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-dsp/${currentBranch}`;
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
  const deleteActionCall = (data) => {
    setType("enquiry_delete");
    setEnquiryId(data.id);
    console.log(data.id, "ghsghghsd");
    setDeleteMessage(
      `Are You Sure You Want To Delete The Enquiry '${data.first_name} ${data.last_name}'?`
    );
    setDisplayConfirmationModal(true);
  };
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const submitDelete = async () => {
    if (enquiryId) {
      const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/delete-enquiry/${enquiryId}`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
      console.log(enquiryId, "idddddddddddddddddddddddd");
      await axios.get(url, config).then((response) => {
        console.log(response, "response.data ");
        if (response.data && response.data.isSuccess) {
          console.log(response.data, "delete true");
          dispatch(setShowMessage("Enquiry Deleted"));
          dispatch(getUserListFromDb());
          setDisplayConfirmationModal(false);
        } else {
          console.log(response.data, "false");
          dispatch(setShowMessage("failed to delete"));
        }
      });
    }
  };

  function handleSubmit() {
    console.log("form save");
    console.log("newEnquiryList", newEnquiryList);
    if (newEnquiryData.dsp) {
      console.log("newEnquiryData", newEnquiryData);
      const formData = {
        customerId: customerId,
        salesperson_id: newEnquiryData.dsp,
      };
      console.log(formData, "formdata******");
      editsalesperson(formData);
    }
    dispatch(setShowMessage("Area is assigned"));
    setShowComponent(false);
  }

  const columns = [
    {
      field: "rowNumber",
      headerName: (
        <Checkbox
          {...label}
          checked={selectAll}
          onClick={handleHeaderCheckboxClick}
        />
      ),
      minWidth: 90,
      // flex: 1,
      renderCell: (params) => (
        <Checkbox
          {...label}
          checked={params.row.checkbox}
          onClick={() => handleChildCheckboxClick(params.row.id)}
        />
      ),
    },
    {
      field: "first_name",
      headerAlign: "left",
      align: "left",
      headerName: translations[currentLanguage].firstname,
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const fistName = params.row.first_name || "-";
        return (
          <div
            className="myBtnForEdit"
            onClick={() => {
              editEnquiryCell(params.row);
            }}
          >
            {fistName}
          </div>
        );
      },
    },
    {
      field: "last_name",
      headerName: translations[currentLanguage].lastname,
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const lastName = params.row.last_name || "-";
        return (
          <div
            className="myBtnForEdit"
            onClick={() => {
              editActionCall(params.row);
            }}
          >
            {lastName}
          </div>
        );
      },
    },
    {
      field: "phone_number",
      headerName: translations[currentLanguage].phoneno,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "email",
      headerName: translations[currentLanguage].email,
      headerAlign: "left",
      align: "left",
      type: "number",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "product",
      headerName: translations[currentLanguage].product,
      minWidth: 200,
      flex: 1,
    },
    {
      field: "sales_person",
      headerName: translations[currentLanguage].salesp,
      headerAlign: "left",
      align: "left",
      type: "number",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "date",
      headerName: translations[currentLanguage].enqdate,
      headerAlign: "left",
      align: "left",
      type: "number",
      minWidth: 130,
      flex: 1,
      valueGetter: (params) => {
        return `${moment(params.row.date).format("LL")}`;
      },
    },
    {
      field: "delivery_date",
      headerName: translations[currentLanguage].expdelivery,
      headerAlign: "left",
      align: "left",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => {
        return `${moment(params.row.delivery_date).format("LL")}`;
      },
    },
    {
      field: "district",
      headerName: translations[currentLanguage].district,
      headerAlign: "left",
      align: "left",
      type: "text",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "taluka",
      headerName: translations[currentLanguage].taluka,
      headerAlign: "left",
      align: "left",
      type: "text",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "village",
      headerName: translations[currentLanguage].village,
      headerAlign: "left",
      align: "left",
      type: "text",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "enquiry_source",
      headerName: translations[currentLanguage].sourceofenq,
      headerAlign: "left",
      align: "left",
      type: "text",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "menu",
      headerName: (
        <FontAwesomeIcon icon={faEllipsisV} style={{ marginRight: "15px" }} />
      ),
      className: "bg-dark",
      sortable: false,
      filterable: false,
      headerAlign: "right",
      align: "right",
      disableColumnMenu: true,
      width: 130,
      // flex: 1,
      position: "sticky",
      renderCell: (params) => (
        <div className="d-flex justify-content-center dotHoverempicon">
          <FontAwesomeIcon icon={faEllipsisV} />
          <div className="expandDiv">
            <Tooltip title="Work Assign">
              <button
                className="myActionBtn m-1"
                onClick={() => {
                  handleworkAssign(params.row, true);
                }}
              >
                <PersonIcon />
              </button>
            </Tooltip>
            <Tooltip title="Edit">
              <button
                onClick={() => {
                  editEnquiryCell(params.row);
                }}
                className="myActionBtn m-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              </button>
            </Tooltip>
            <Tooltip title="Delete">
              <button
                onClick={() => {
                  deleteActionCall(params.row);
                }}
                className="myActionBtn m-1"
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
            </Tooltip>
            <Tooltip title="FollowUp">
              <button
                onClick={() => {
                  handleFolloup(params.row);
                }}
                className="myActionBtn m-1"
              >
                <LabelImportantIcon />
              </button>
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];
  const getEnquiriesFromDb = async () => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-enquiries`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };

    try {
      const response = await Axios.get(url, config);

      if (response.data?.isSuccess) {
        setEnquiries(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      throw error; // Rethrow the error for handling in the calling code
    }
  };
  let counter = 1;
  useEffect(() => {
    getEnquiriesFromDb();
  }, []);

  useEffect(() => {
    console.log(enquiries, "enquiries");
    const rowsData = enquiries.map((item, index) => ({
      ...item,
      rowNumber: item.id,
      checkbox: selectAll,
    }));
    setRowData(rowsData);
  }, [enquiries, selectAll]);

  const changeHandler = (e) => {
    console.log(e, "e**********");
    const name = e.target.name;
    const value = e.target.value;
    console.log(
      "in changeHandlerNewEnquiry <<name>>:",
      name,
      ", <<value>>:",
      value
    );
    setNewEnquiryData((newEnquiryData) => ({
      ...newEnquiryData,
      [name]: value,
    }));
  };

  return (
    <>
      <div>
        <div className="myTbl">
          <div className="my-3  d-flex align-items-end justify-content-end">
            <div className="file-upload-container mx-2">
              <label className="custom-label mx-1" htmlFor="csv">
                Upload Enquiry
              </label>
              <input
                ref={fileInputRef}
                onChange={onChangeCSVFile}
                autoComplete="off"
                type="file"
                name="enquiryCSV"
                required
                accept=".csv"
                className="myInput inputElement"
              />
              <button
                className="btn btn-primary mx-1"
                onClick={handleCSVUpload}
              >
                Upload
              </button>
            </div>
            <div
              onClick={() => {
                navigate("/sale/enquiries/enquiry");
              }}
              className="d-flex align-items-center px-1"
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
              <h6 className="m-0 ps-1">
                {translations[currentLanguage].addenq}
              </h6>
            </div>
            <div
              onClick={handleworkAssign}
              className="d-flex align-items-center px-1"
              type="button"
            >
              <PersonIcon />
              <h6 className="m-0 ps-1">
                {translations[currentLanguage].workassign}
              </h6>
            </div>
          </div>

          <div
            className="tableMenuHover"
            style={{ height: "85vh", width: "100%" }}
          >
            <DataGrid
              rows={rowData}
              columns={columns}
              getRowId={(params) => {
                return params.rowNumber;
              }}
              style={{
                fontFamily: "Poppins",
                padding: 5,
                backgroundColor: "white",
              }}
              className="rounded"
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                ...enquiries.initialState,
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              components={{
                Toolbar: GridToolbar,
                NoRowsOverlay: () => (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span>There is no Enquiry with current branch</span>
                  </div>
                ),
              }}
              componentsProps={{
                toolbar: {
                  position: "right",
                  style: { fontFamily: "Poppins", alignSelf: "end" },
                },
              }}
              rowSelection={false}
              autoPageSize={false}
            />
          </div>
        </div>
        <Modal show={showComponent} onHide={hideModal}>
          <Modal.Header closeButton>
            <h5 className="modal-title" id="TalukaModalLabel">
              Work Assign
            </h5>
          </Modal.Header>
          <Modal.Body>
            <div className="">
              <div className="row mt-5">
                <h5>Select Sales Person</h5>

                <select
                  onChange={changeHandler}
                  defaultValue={selecteduser}
                  name="dsp"
                  className="myInput inpClr "
                >
                  <option value="0" className="myLabel">
                    select Sales Person
                  </option>
                  {newEnquiryList.listDsp &&
                    newEnquiryList.listDsp.length > 0 &&
                    newEnquiryList.listDsp.map((person) => {
                      const fullName = `${person.first_name} ${person.last_name}`;
                      return (
                        <option
                          key={person.id}
                          value={person.id}
                          className="myLabel"
                        >
                          {fullName}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={hideModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <AlertDeleteModal
        showModal={displayConfirmationModal}
        confirmModal={submitDelete}
        hideModal={hideConfirmationModal}
        type={type}
        id={enquiryId}
        message={deleteMessage}
      />
    </>
  );
}
