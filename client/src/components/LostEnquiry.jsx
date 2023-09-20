import React, {useState} from 'react'
import DatePicker from "react-datepicker";

const LostEnquiry = () => {
      const [startDate, setStartDate] = useState(new Date());
  return (
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
      <button
        className="col-12 col-sm-5 col-lg-2 myBtn py-2 my-3"
        type="button"
      >
        Save Lost Enquiry
      </button>
    </div>
  );
}

export default LostEnquiry
