import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const EnquiryBookingChart = () => {
  useEffect(() => {
    const ctx = document.getElementById('enquiryBookingChart').getContext('2d');

    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Enquiries',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          data: [10, 20, 15, 30, 25, 12],
        },
        {
          label: 'Bookings',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          data: [5, 10, 8, 15, 12, 6],
        },
      ],
    };

    const config = {
      type: 'bar',
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

export default EnquiryBookingChart;
