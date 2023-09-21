import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import DatePicker from "react-datepicker";
import Delivery from "./Delivery";
import LostEnquiry from "./LostEnquiry";
import InValidEnquiry from "./InValidEnquiry";
import {
  enquiryFollowUpDB,
  clearEnquiryFollowupState,
} from "../redux/slices/followupSlice";
import { setShowMessage } from "../redux/slices/notificationSlice";

const FollowUp = () => {
  const enquiryFollowupSlice = useSelector(
    (state) => state.enquiryFollowupSlice.enquiryFollowupSlice
  );
  const [startDate, setStartDate] = useState(new Date());
  const [value, setValue] = useState("followup");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const editEnquiryData = location.state;
  const [followupdata, setFollwUpData] = useState({
    last_discussion: "",
    followupdate: new Date(),
    next_followup_date: new Date(),
  });

  const redirectModal = () => {
    navigate(-1);
  };

  function changeHandler(e) {
    const name = e.target.name;
    const value = e.target.value;
    setFollwUpData((followupdata) => ({ ...followupdata, [name]: value }));
  }

  function clearStateAndInp() {
    setFollwUpData({
      last_discussion: "",
      followupdate: new Date(),
      next_followup_date: new Date(),
    });
  }
  const handlesave = () => {
    if (editEnquiryData.id) {
      followupdata.enquiryId = editEnquiryData.id;
      followupdata.customer_id = editEnquiryData.id;
        dispatch(enquiryFollowUpDB(followupdata));
      console.log(followupdata, "followupdata");
    }
clearStateAndInp();
dispatch(setShowMessage("Follow Up Inserted"));
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

 
  


  return (
    <main className="bg-white p-3 rounded">
      <div className=" row m-0">
        <div className="col-6">
          <h5 className="m-0">Set Enquiry Stage</h5>
        </div>
        <div className="col-6 d-flex align-items-end justify-content-end">
          <Button
            variant="btn btn-warning mx-1"
            style={{
              width: "70px",
              height: "35px",
              fontSize: "14px",
              borderRadius: "20px",
            }}
            onClick={() => {
              redirectModal();
            }}
          >
            BACK
          </Button>
        </div>
      </div>
      <div>
        <RadioGroup
          className="d-flex justify-content-around"
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value="followup"
            control={<Radio />}
            label="Follow Up"
          />
          <FormControlLabel
            value="delivery"
            control={<Radio />}
            label="Deliver"
          />
          <FormControlLabel value="lost" control={<Radio />} label="Lost" />
          <FormControlLabel
            value="invalidenquiry"
            control={<Radio />}
            label="InValid Enquiry"
          />
        </RadioGroup>
      </div>
      {value === "followup" ? (
        <div className="mt-4">
          <div className="d-flex">
            <p className="m-3">Select Next Follow Up Date*</p>
            <DatePicker
              className="m-3 p-1 rounded-pill text-center"
              selected={followupdata.next_followup_date}
              name="next_followup_date"
              onChange={(date) =>
                setFollwUpData((followupdata) => ({
                  ...followupdata,
                  ["next_followup_date"]: date,
                }))
              }
            />
          </div>
          <div className="mt-2">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">
              Discussion
            </label>
            <textarea
              onChange={changeHandler}
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="4"
              name="last_discussion"
              value={followupdata.last_discussion}
            ></textarea>
          </div>
          <button
            onClick={handlesave}
            className="col-12 col-sm-5 col-lg-2 myBtn py-2 my-3"
            type="button"
          >
            Save Follow Up Details
          </button>
          <div>
            <p>Schedule Detail</p>
          </div>
          <p className="d-flex justify-content-center mt-3 text-danger">
            NO Call Schedule
          </p>
        </div>
      ) : value === "delivery" ? (
        <Delivery />
      ) : value === "lost" ? (
        <LostEnquiry />
      ) : value === "invalidenquiry" ? (
        <InValidEnquiry />
      ) : null}
    </main>
  );
};

export default FollowUp;
