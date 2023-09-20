import React,{useState} from 'react'
import DatePicker from "react-datepicker";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useLocation } from "react-router";

const Delivery = () => {
     const [startDate, setStartDate] = useState(new Date());
     const [radio, setRadio] = useState("No");
      const location = useLocation();
      const editEnquiryData = location.state;
     const handleChangeRadio = (event) => {
       setRadio(event.target.value);
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
    <>
      <div className=" row mt-4">
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity="info" className="fw-bold">
            Delivery :-{editEnquiryData.first_name}   {editEnquiryData.last_name} ,Enquiry. {formatDate(editEnquiryData.date)}
          </Alert>
        </Stack>
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
      <button
        className="col-12 col-sm-5 col-lg-2 myBtn py-2 my-3"
        type="button"
      >
        Save Delivery
      </button>
    </>
  );
}

export default Delivery
