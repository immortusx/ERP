import translations from "../../../assets/locals/translations";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import {
  addHolidayToDb,
  clearaddHoliday,
} from "../../../redux/slices/Master/Holiday/holidaySlice";
import { editHolidayToDb } from "../../../redux/slices/Master/Holiday/editholidaySlice";
import Axios from "axios";
import { getCategory } from "../Category/getEditCategory";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import AlertDeleteModal from "../../AlertDelete/AlertDeleteModal";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Checkbox from "@mui/material/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { Tooltip } from "@mui/material";
import { setShowMessage } from "../../../redux/slices/notificationSlice";
import moment from "moment/moment";

const Holiday = () => {
  const currentLanguage = useSelector((state) => state.language.language);
  const holidayState = useSelector((state) => state.holidayState.holidayState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const redirectModal = () => {
    navigate("/administration/configuration");
  };
  const [holiday, setHoliday] = useState({
    holidayname: "",
    holiday_date: new Date(),
    description: "",
  });

  const [deleteMessage, setDeleteMessage] = useState(null);
  const [show, setShow] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [holidaylist, setHolidayList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [type, setType] = useState(null);
  const [id, setId] = useState(null);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const handleHeaderCheckboxClick = () => {
    setSelectAll(!selectAll);
  };

  const handleChildCheckboxClick = (itemId) => {
    const updatedRowsData = rowData.map((row) => {
      if (row.id == itemId) {
        return {
          ...row,
          checkbox: !row.checkbox,
        };
      }
      return row;
    });
    setRowData(updatedRowsData);
  };
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const handleShow = () => {
    setShow(1);
  };
  const handleClose = () => {
    setShow(0);
    setHoliday({
      holidayname: "",
      holiday_date: new Date(),
      description: "",
    });
  };

  function changeHandler(e) {
    const name = e.target.name;
    const value = e.target.value;

    setHoliday((holiday) => ({ ...holiday, [name]: value }));
  }

  const savedata = () => {
    if (show === 2) {
      console.log(holiday, "holidayholidayholiday");
      dispatch(editHolidayToDb(holiday));
      dispatch(setShowMessage("Holiday Edited"));
      setShow(0);
      setHoliday({
        holidayname: "",
        holiday_date: new Date(),
        description: "",
      });
    } else {
      dispatch(addHolidayToDb(holiday));
      dispatch(setShowMessage("Holiday Added"));
      clearInpHook();
      setShow(0);
      console.log(holiday, "holidayholidayholiday");
      fetchHolidayList()
    }
  };
  useEffect(() => {
    if (holidayState?.isSuccess) {
      if (holidayState.message.result === "success") {
        dispatch(clearaddHoliday());
      }
    }
  }, [holidayState]);


  const fetchHolidayList = async () => {
    try {
      const url = `${process.env.REACT_APP_NODE_URL}/api/get-holiday-list`;
      const token = localStorage.getItem("rbacToken");
      const config = {
        headers: {
          token: token,
        },
      };

      const response = await Axios.get(url, config);

      if (response.data?.isSuccess) {
        console.log(response.data.result, "response.data.result");
        setHolidayList(response.data.result);
      } else {
        console.error("API request was not successful");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteActionCall = (data) => {
    console.log(data, "ddddddfghjkl;")
    setType("holiday_delete");
    setId(data.id);
    setDeleteMessage(
      `Are You Sure You Want To Delete The Holiday '${data.holidayname}'?`
    );
    setDisplayConfirmationModal(true);
  };

  const submitDelete = async (e, id) => {
    try {
      const url = `${process.env.REACT_APP_NODE_URL}/api/delete-holidayStatus/${id}`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
      const response = await Axios.get(url, config);

      if (response.data && response.data.isSuccess) {
        console.log("Holiday Deleted");
        dispatch(setShowMessage("Holiday Deleted"));
        setDisplayConfirmationModal(false);
      } else {
        console.log("Failed to delete");
        dispatch(setShowMessage("Failed to delete"));
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle the error appropriately, e.g., show an error message to the user.
    }
  };


  useEffect(() => {
    if (holidayState?.isSuccess) {
      if (holidayState.message.result === "success") {
        dispatch(clearaddHoliday());
      }
    }
  }, [holidayState]);


  const clearInpHook = () => {
    setHoliday({
      holidayname: "",
      holiday_date: new Date(),
      description: "",
    });
  }

  const editeHoliday = async (id) => {
    try {
      const url = `${process.env.REACT_APP_NODE_URL}/api/get-holiday/${id}`;
      const token = localStorage.getItem("rbacToken");
      const config = {
        headers: {
          token: token,
        },
      };

      const response = await Axios.get(url, config);

      if (response.data?.isSuccess) {
        console.log(response.data.result[0], "response.data.result");

        const apiDate = new Date(response.data.result[0].holiday_date);

        setHoliday({
          ...response.data.result[0],
          holiday_date: apiDate,
        });

        setShow(2);
      } else {
        console.error("API request was not successful");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    console.log(holidaylist, "holidaylist");
    const rowsData = holidaylist.map((item, index) => ({
      ...item,
      rowNumber: item.id,
      checkbox: selectAll,
    }));
    setRowData(rowsData);
  }, [holidaylist, selectAll]);

  const columns = [
    {
      field: "id",
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
      field: "holidayname",
      headerAlign: "left",
      align: "left",
      headerName: translations[currentLanguage].holidayname,
      minWidth: 120,
      flex: 1,
      valueGetter: (params) => {
        return `${params.row.holidayname ? params.row.holidayname : "-"}`;
      },
    },
    {
      field: "holiday_date",
      headerAlign: "left",
      align: "left",
      headerName: translations[currentLanguage].date,
      minWidth: 250,
      flex: 1,
      valueGetter: (params) => {
        const date = new Date(params.row.holiday_date);
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        return date.toLocaleDateString(undefined, options);
      },
    },
    {
      field: "description",
      headerAlign: "left",
      align: "left",
      headerName: translations[currentLanguage].description,
      minWidth: 250,
      flex: 1,
      valueGetter: (params) => {
        return `${params.row.description ? params.row.description : "-"}`;
      },
    },
    {
      field: "menu",
      headerName: <FontAwesomeIcon icon={faEllipsisV} />,
      className: "bg-dark",
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      maxWidth: 50,
      // flex: 1,
      position: "sticky",
      renderCell: (params) => (
        <div className="d-flex justify-content-center dotHover">
          <FontAwesomeIcon icon={faEllipsisV} />
          <div className="expandDiv">
            <Tooltip title={translations[currentLanguage].edit}>
              <button
                className="myActionBtn m-1"
                onClick={() => {
                  editeHoliday(params.row.id);
                }}
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
            <Tooltip title={translations[currentLanguage].delete}>
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
          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="my-3 d-flex align-items-end justify-content-end">
        <div className="d-flex align-items-center" type="button">
          <h6 className="m-0 ps-1">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleShow}
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
              &nbsp; {translations[currentLanguage].addholiday}
            </button>
          </h6>
          <Button
            variant="btn btn-warning mx-1"
            style={{
              width: "75px",
              height: "40px",
              fontSize: "14px",
              borderRadius: "20px",
            }}
            onClick={() => {
              redirectModal();
            }}
          >
            {translations[currentLanguage].back}
          </Button>
        </div>
      </div>
      <div className="addUser myBorder bg-white rounded p-3">
        <div
          className="mt-4 tableMenuHover"
          style={{ height: "85vh", width: "100%" }}
        >
          <DataGrid
            rows={rowData}
            columns={columns}
            getRowId={(params) => {
              return params.id;
            }}
            className="rounded"
            style={{
              fontFamily: "Poppins",
              padding: 5,
              backgroundColor: "white",
            }}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              ...categoryList.initialState,
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
                  <span>There is no Users with current branch</span>
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
        <AlertDeleteModal
          showModal={displayConfirmationModal}
          hideModal={hideConfirmationModal}
          confirmModal={submitDelete}
          type={type}
          id={id}
          message={deleteMessage}
        />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <h5>
            {show === 1
              ? translations[currentLanguage].addholiday
              : translations[currentLanguage].editHoliday}
          </h5>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="mb-3">
              <label htmlFor="recipient-name" className="col-form-label">
                {translations[currentLanguage].holidayname}:
              </label>
              <input
                type="text"
                name="holidayname"
                className="form-control"
                onChange={changeHandler}
                defaultValue={holiday.holidayname}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="recipient-name" className="col-form-label">
                {translations[currentLanguage].date}:
              </label>
              <div>
                <DatePicker
                  className="form-control"
                  selected={holiday.holiday_date}
                  dateFormat="dd/MM/yyyy"
                  onChange={(date) =>
                    setHoliday((holiday) => ({
                      ...holiday,
                      ["holiday_date"]: date,
                    }))
                  }
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="recipient-name" className="col-form-label">
                {translations[currentLanguage].description}:
              </label>
              <input
                type="text"
                name="description"
                className="form-control"
                onChange={changeHandler}
                defaultValue={holiday.description}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={savedata}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Holiday;
