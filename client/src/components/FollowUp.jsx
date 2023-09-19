import React,{useState} from 'react'
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import DatePicker from "react-datepicker";

const FollowUp = () => {
    const navigate = useNavigate();

const redirectModal = () => {
  navigate(-1);
}
const [value, setValue] = useState(''); 
 const [startDate, setStartDate] = useState(new Date());
    const [radio, setRadio] = useState("No"); 
    const handleChangeRadio = (event) => {
      setRadio(event.target.value); 
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
              selected={startDate}
              //   onChange={(date) => setStartDate(date)}
            />
          </div>
          <div className="mt-2">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">
              Discussion
            </label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="4"
            ></textarea>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-primary p-2" type="button">
              Save Follow Up Details
            </button>
          </div>
          <div>
            <p>Schedule Detail</p>
          </div>
          <p className="d-flex justify-content-center mt-3 text-danger">
            NO Call Schedule
          </p>
        </div>
      ) : value === "delivery" ? (
        <>
          <div className=" row mt-4">
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                Enter Mobile Number
              </label>
              <input
                className="myInput inputElement"
                autoComplete="false"
                type="text"
                name="mobileNumber"
                placeholder=" Enter Mobile Number"
              />
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                Enter Modal
              </label>
              <select className="inpClr myInput" name="model">
                <option value="0" className="myLabel">
                  select Modal
                </option>
              </select>
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                Enter Varient
              </label>
              <select className="inpClr myInput" name="varient">
                <option value="0" className="myLabel">
                  select Varient
                </option>
              </select>
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                Enter Chassis No
              </label>
              <input
                className="myInput inputElement"
                autoComplete="false"
                type="text"
                name="chassisno"
                placeholder="Enter Chassis No"
              />
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                Mode Of Finance
              </label>
              <select className="inpClr myInput" name="finance">
                <option value="0" className="myLabel">
                  select Mode Of Finance
                </option>
              </select>
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                select Bank
              </label>
              <select className="inpClr myInput" name="bank">
                <option value="0" className="myLabel">
                  select Bank
                </option>
              </select>
            </section>
            <section className="datePicker d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                select Delivery Date
              </label>
              <DatePicker
                selected={startDate}
                dateFormat="dd/MM/yyyy"
                // onChange={(date) =>
                //   setNewEnquiryData((newEnquiryData) => ({
                //     ...newEnquiryData,
                //     ["deliveryDate"]: date,
                //   }))
                // }
              />
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                Target Retail Price
              </label>
              <input
                className="myInput inputElement"
                autoComplete="false"
                type="text"
                name="price"
                placeholder="  Target Retail Price"
              />
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <div className="d-flex mt-4">
                <input
                  checked={radio === "Yes"}
                  value="Yes"
                  onChange={handleChangeRadio}
                  type="radio"
                  id="html"
                  name="exchange"
                />
                <label className="ms-1 myLabel" htmlFor="html">
                  Exchange Yes
                </label>

                <input
                  defaultChecked={radio === "No"}
                  onChange={handleChangeRadio}
                  value="No"
                  className="ms-3"
                  type="radio"
                  id="css"
                  name="exchange"
                />
                <label className="ms-1 myLabel" htmlFor="css">
                  Exchange No
                </label>
              </div>
              {radio === "Yes" && (
                <>
                  <p className="mt-3">Select Details*</p>
                  <section className="d-flex mt-3 flex-column col-12">
                    <input
                      className="myInput inputElement"
                      autoComplete="false"
                      type="text"
                      name="eicher"
                      placeholder="EICHER"
                    />
                  </section>
                  <section className="d-flex mt-3 flex-column col-12">
                    <select className="inpClr myInput" name="bank">
                      <option value="0" className="myLabel">
                        select modal
                      </option>
                    </select>
                  </section>
                  <section className="d-flex mt-3 flex-column col-12">
                    <select className="inpClr myInput" name="bank">
                      <option value="0" className="myLabel">
                        select Varient
                      </option>
                    </select>
                  </section>
                  <section className="d-flex mt-3 flex-column col-12">
                    <input
                      className="myInput inputElement"
                      autoComplete="false"
                      type="text"
                      name="manufracturer"
                      placeholder="Manufracturer"
                    />
                  </section>
                  <section className="d-flex mt-3 flex-column col-12">
                    <select className="inpClr myInput" name="bank">
                      <option value="0" className="myLabel">
                        select Condition
                      </option>
                    </select>
                  </section>
                  <section className="d-flex mt-3 flex-column col-12">
                    <input
                      className="myInput inputElement"
                      autoComplete="false"
                      type="text"
                      name="purches"
                      placeholder="Dealer Purches Price"
                    />
                  </section>{" "}
                  <section className="d-flex mt-3 flex-column col-12">
                    <input
                      className="myInput inputElement"
                      autoComplete="false"
                      type="text"
                      name="market"
                      placeholder="Market Price(Rs.)"
                    />
                  </section>{" "}
                  <section className="d-flex mt-3 flex-column col-12">
                    <input
                      className="myInput inputElement"
                      autoComplete="false"
                      type="text"
                      name="oldtractor"
                      placeholder="Old Tractor Chassis No"
                    />
                  </section>
                  {/* Add more conditional sections here */}
                </>
              )}
            </section>
          </div>
          <div className=" mt-3">
            <button className="btn btn-primary p-2" type="button">
              Save Delivery
            </button>
          </div>
        </>
      ) : value === "lost" ? (
        <div className=" row mt-4">
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Enter Maker
            </label>
            <select className="inpClr myInput" name="model">
              <option value="0" className="myLabel">
                select Maker
              </option>
            </select>
          </section>
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Enter Modal
            </label>
            <select className="inpClr myInput" name="model">
              <option value="0" className="myLabel">
                select Modal
              </option>
            </select>
          </section>
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Enter Varient
            </label>
            <select className="inpClr myInput" name="varient">
              <option value="0" className="myLabel">
                select Varient
              </option>
            </select>
          </section>

          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Select Commerical Reason 1
            </label>
            <select className="inpClr myInput" name="finance">
              <option value="0" className="myLabel">
                Select Commerical Reason 1
              </option>
            </select>
          </section>
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Select Non-Commerical Reason 2
            </label>
            <select className="inpClr myInput" name="bank">
              <option value="0" className="myLabel">
                Select Non-Commerical Reason 2
              </option>
            </select>
          </section>
          <section className="datePicker d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              select Enquiry Lost Date
            </label>
            <DatePicker
              selected={startDate}
              dateFormat="dd/MM/yyyy"
              // onChange={(date) =>
              //   setNewEnquiryData((newEnquiryData) => ({
              //     ...newEnquiryData,
              //     ["deliveryDate"]: date,
              //   }))
              // }
            />
          </section>
          <div className="mt-3">
            <button className="btn btn-primary p-2" type="button">
              Save Lost Enquiry
            </button>
          </div>
        </div>
      ) : value === "invalidenquiry" ? (
        <>
          <div className="mt-2">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">
              Reason
            </label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="4"
            ></textarea>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary p-2" type="button">
              Close Enquiry
            </button>
          </div>
        </>
      ) : null}
    </main>
  );
}

export default FollowUp
