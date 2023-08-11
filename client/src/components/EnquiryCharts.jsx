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
          console.log(response.data.result);
          setResultData(response.data.result);
        }
      });
    };
    getChartsData();
  }, []);
  useEffect(() => {
    if (resultData) {
      resultData.map((item) => {
        console.log(item.month, "userrrrrrrr");
        setChartData({
          labels: [item.month],
          datasets: [
            {
              label: "Enquiries",
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              data: [item.totalEnquiry],
            },
            {
              label: "Booking",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              data: [item.totalbooking],
            },
          ],
        });
      });
    }
  }, [resultData]);
  
  useEffect(() => {
    const ctx = document.getElementById("enquiryBookingChart").getContext("2d");

    const data = {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Enquiries",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          data: [10, 20, 15, 30, 25, 12, 18, 22, 28, 14, 21, 27],
        },
        {
          label: "Bookings",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          data: [5, 10, 8, 15, 12, 6, 9, 13, 16, 7, 11, 17],
        },
      ],
    };
    useEffect(()=> {
      if(chartData){
        console.log(chartData,'chartnnbnb')
        console.log(data,'data')
        
      }
    },[chartData])

    const config = {
      type: "bar",
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    new Chart(ctx, config);
  }, []);

  return (
    <div className="chart-container">
      <canvas id="enquiryBookingChart"></canvas>
    </div>
  );
};

export default EnquiryCharts;
