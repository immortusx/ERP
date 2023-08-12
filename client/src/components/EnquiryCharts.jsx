import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const EnquiryCharts = () => {
  const [resultData, setResultData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        backgroundColor: "",
        data: [],
      },
      {
        label: "",
        backgroundColor: "",
        data: [],
      },
    ],
  });
  useEffect(() => {
    const getChartsData = async () => {
      const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-total-enquiry-booking`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
      await axios.get(url, config).then((response) => {
        if (response.data && response.data.isSuccess) {
          // console.log(response.data.result);
          setResultData(response.data.result);
        }
      });
    };
    getChartsData();
  }, []);
  useEffect(() => {
    if (resultData.length > 0) {
      const updatedLables = resultData.map((item) => item.month);
      const updateTotalEnquiry = resultData.map((item) => item.totalEnquiry);
      const updateTotalBooking = resultData.map((item) => item.totalbooking);
      setChartData((preData) => ({
        ...preData,
        labels: updatedLables,
        datasets: [
          {
            label: "Enquiries",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            data: updateTotalEnquiry,
          },
          {
            label: "Booking",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            data: updateTotalBooking,
          },
        ],
      }));
    }
  }, [resultData]);

  useEffect(() => {
    if (chartData.labels.length > 0) {
      const ctx = document
        .getElementById("enquiryBookingChart")
        .getContext("2d");

      const config = {
        type: "bar",
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      };

      new Chart(ctx, config);
    }
  }, [chartData]);

  return (
    <div className="chart-container">
      <canvas id="enquiryBookingChart"></canvas>
    </div>
  );
};

export default EnquiryCharts;
