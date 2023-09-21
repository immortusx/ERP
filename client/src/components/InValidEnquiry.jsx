import React, { useState, useEffect } from "react";
import AlertDeleteModal from "./AlertDelete/AlertDeleteModal";
import { useNavigate, useLocation } from "react-router";
import Axios from "axios";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const InValidEnquiry = () => {
  const [confirmation, setConfirmation] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [reason, setReason] = useState("");
  const [type, setType] = useState(null);
  const location = useLocation();
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [enquiryId, setEnquiryId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [enquiryData, setEnquiryData] = useState({});
  const editEnquiryData = location.state;
  console.log(editEnquiryData, "editEnquiryData");

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setReason(value);
  };
  useEffect(() => {
    if (editEnquiryData) {
      // setEnquiryData(editEnquiryData);
      setCustomerId(editEnquiryData.id);
    }
  }, [editEnquiryData]);

  const handleCloseEnquiry = () => {
    if (editEnquiryData) {
      if (reason.length > 0) {
        setType("Invalid enquiry_remove");
        setEnquiryId(editEnquiryData.id);
        setDeleteMessage(
          `Are You Sure You Want To Delete The Enquiry '${editEnquiryData.first_name} ${editEnquiryData.last_name}'?`
        );
        setConfirmation(true);
      }
    }
  };
  const hideConfirmationModal = () => {
    setConfirmation(false);
  };

  const handledelete = async () => {
    if (customerId) {
      const customer_id = customerId;
      const formData = {
        reason: reason,
        enquiry_stage: "INVALID",
      };
      const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/close-enquiry/${customer_id}`;
      console.log("closing enqury", url);
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
      console.log(config, "config");
      console.log(formData, "formData");
      await Axios.post(url, formData, config).then((response) => {
        console.log(response.data, "closing");
        if (response.data) {
          // dispatch(getEnquiryData());
        }
      });
    }
    setReason("");
    setConfirmation(false);
  };

  const formatDate = (inputDate) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();

    const daySuffix = getDaySuffix(day);

    return `${day}${daySuffix} ${month} ${year}`;
  };

  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  return (
    <div>
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert severity="info" className="fw-bold">
          Enquiry :-{editEnquiryData.first_name} {editEnquiryData.last_name} ,{" "}
          {formatDate(editEnquiryData.date)}
        </Alert>
      </Stack>

      <div className="mt-2">
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          Reason *
        </label>
        <textarea
          onChange={changeHandler}
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="4"
          name="reason"
          value={reason}
        ></textarea>
      </div>
      <button
        className="col-12 col-sm-5 col-lg-2 myBtn py-2 my-3"
        type="button"
        onClick={handleCloseEnquiry}
      >
        Close Enquiry
      </button>

      <AlertDeleteModal
        showModal={confirmation}
        confirmModal={handledelete}
        hideModal={hideConfirmationModal}
        type={type}
        id={enquiryId}
        message={deleteMessage}
      />
    </div>
  );
};

export default InValidEnquiry;
