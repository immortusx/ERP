import React from "react";
import EnquiryCharts from "./EnquiryCharts";
import SalesCharts from "./SalesCharts";


const Dashboard = () => {
  return (
    <div>
      <div className="dashboard">
        <div className="dashboard-header bg-white">
          <div className="left-container">
            <h6 className="headingStyles mx-1">Dashboard</h6>
          </div>
          <div className="middle-container">
            <span className="search-item">
              <input
                className="search-input mx-1"
                placeholder="Search for...."
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                color="#00a2ff"
                fill="currentColor"
                class="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </span>
          </div>
          <div className="right-container">
            <div className="mx-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                color="#00a2ff"
                fill="currentColor"
                class="bi bi-bell"
                viewBox="0 0 16 16"
              >
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
              </svg>
            </div>
            <div className="mx-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                color="#00a2ff"
                fill="currentColor"
                class="bi bi-envelope"
                viewBox="0 0 16 16"
              >
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-2">
        <div className="col-md-8 bg-white">
          <h6 className="enquiry-charts py-1 px-2">Enquiry</h6>
          <EnquiryCharts />
        </div>
        <div className="col-md-4 bg-white">
          <h6 className="sales-charts py-1 px-2">Sales</h6>
          <SalesCharts />
        </div>
      </div>
      <div className="row my-2 justify-content-between">
        <div className="col-md-3 growth-item">Impressive 300% Growth</div>
        <div className="col-md-3 growth-item">Record Sales (July)</div>
        <div className="col-md-3 growth-item">
          Excellent Customer Satisfaction
        </div>
      </div>
      <div className="row my-2 justify-content-between">
        <div className="col-md-3 growth-item">Optimal Payout Scaling</div>
        <div className="col-md-3 growth-item">Strong Booking Numbers</div>
        <div className="col-md-3 growth-item">Uninterrupted Availability</div>
      </div>
    </div>
  );
};

export default Dashboard;
