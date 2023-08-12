import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const SalesCharts = () => {
  useEffect(() => {
    const ctx = document.getElementById('salesPieChart').getContext('2d');

    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Sales',
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
          ],
          data: [2000, 3000, 2500, 3500, 2800, 3200, 4050, 3000, 4200, 3800, 2700, 3200], // Sample sales data for all 12 months
        },
      ],
    };

    const config = {
      type: 'pie', // Using a pie chart for sales
      data: data,
    };

    new Chart(ctx, config);
  }, []);

  return (
    <div className="chart-container">
      <canvas id="salesPieChart"></canvas>
    </div>
  );
};

export default SalesCharts;
