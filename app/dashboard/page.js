
"use client"
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.details || 'Network response was not ok');
          });
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const barData = {
    labels: ['Total Products', 'Total Menus', 'Products with Discounts', 'Disabled Products'],
    datasets: [
      {
        label: 'Count',
        data: [data.totalProducts, data.totalMenus, data.productsWithDiscount, data.disabledProducts],
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#F44336']
      }
    ]
  };

  const pieData = {
    labels: ['Active Products', 'Disabled Products'],
    datasets: [
      {
        label: 'Products',
        data: [data.totalProducts - data.disabledProducts, data.disabledProducts],
        backgroundColor: ['#4CAF50', '#F44336']
      }
    ]
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Summary</h2>
          <Bar data={barData} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Products Status</h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
