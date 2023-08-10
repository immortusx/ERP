import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const SalesChart = () => {
  useEffect(() => {
    const ctx = document.getElementById('salesChart').getContext('2d');

    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Sales',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          data: [2000, 3000, 2500, 3500, 2800, 3200], // Sample sales data
        },
      ],
    };

    const config = {
      type: 'line', // Using a line chart for sales
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
      <canvas id="salesChart"></canvas>
    </div>
  );
};

export default SalesChart;
