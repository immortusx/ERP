import React from 'react'

const InValidEnquiry = () => {
  return (
    <div>
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
      <button
        className="col-12 col-sm-5 col-lg-2 myBtn py-2 my-3"
        type="button"
      >
        Close Enquiry
      </button>
    </div>
  );
}

export default InValidEnquiry
