import React, { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";

const EnquiryCharts = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [chartData, setChartData] = useState(null);

  const chartRef = useRef(null);

  useEffect(() => {
    const getMonthlyData = async () => {
      const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-total-enquiry-booking`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
      await axios.get(url, config).then((response) => {
        if (response.data && response.data.isSuccess) {
          setMonthlyData(response.data.result);
        }
      });
    };
    getMonthlyData();
  }, []);

  useEffect(() => {
    const getDailyData = async () => {
      const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-todays-enquiry-booking`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
      axios.get(url, config).then((response) => {
        if (response.data && response.data.isSuccess) {
          setDailyData(response.data.result);
        }
      });
    };
    getDailyData();
  }, []);

  useEffect(() => {
    if (monthlyData.length > 0 || dailyData.length > 0) {
      const labels = [];
      const monthlyEnquiries = [];
      const monthlyBookings = [];
      const dailyEnquiries = [];
      const dailyBookings = [];

      monthlyData.forEach((item) => {
        labels.push(item.month);
        monthlyEnquiries.push(item.totalEnquiry);
        monthlyBookings.push(item.totalbooking);
      });

      dailyData.forEach((item) => {
        labels.push(item.day);
        dailyEnquiries.push(item.totalEnquiry);
        dailyBookings.push(item.totalbooking);
      });

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Monthly Enquiries",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            data: [
              ...monthlyEnquiries,
              ...new Array(dailyData.length).fill(null),
            ],
          },
          {
            label: "Monthly Bookings",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            data: [
              ...monthlyBookings,
              ...new Array(dailyData.length).fill(null),
            ],
          },
          {
            label: "Todays Enquiries",
            backgroundColor: "rgba(255, 99, 71, 0.6)",
            data: [
              ...new Array(monthlyData.length).fill(null),
              ...dailyEnquiries,
            ],
          },
          {
            label: "Todays Bookings",
            backgroundColor: "rgba(80, 112, 120, 5.3)",
            data: [
              ...new Array(monthlyData.length).fill(null),
              ...dailyBookings,
            ],
          },
        ],
      });
    }
  }, [monthlyData, dailyData]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  }, [chartData]);

  useEffect(() => {
    if (chartData) {
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

      chartRef.current = new Chart(ctx, config);
    }
  }, [chartData]);

  return (
    <div className="chart-container">
      <canvas id="enquiryBookingChart"></canvas>
    </div>
  );
};

export default EnquiryCharts;
