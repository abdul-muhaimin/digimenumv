'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Button } from '@/components/ui/button';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Spinner from '@/components/ui/Spinner'; // Import the Spinner component
import { useUser } from '@clerk/nextjs';
import { useUpsertUser } from '@/hooks/useUpsertUser';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const { isLoaded, isSignedIn, user } = useUser(); // Use Clerk's useUser hook to get authentication status
  const [dashboardData, setDashboardData] = useState(null);
  const [timeFrame, setTimeFrame] = useState('daily');
  const [loading, setLoading] = useState(true); // Add loading state

  useUpsertUser(isLoaded, isSignedIn, user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await fetch(`/api/dashboard?timeFrame=${timeFrame}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    if (isSignedIn) {
      fetchDashboardData();
    }
  }, [timeFrame, isSignedIn]);

  const handleTimeFrameChange = (frame) => {
    setTimeFrame(frame);
  };

  const aggregateVisits = (visits) => {
    const intervals = [];
    const intervalDuration = 30 * 60 * 1000; // 30 minutes in milliseconds

    visits.forEach((visit) => {
      const visitTime = new Date(visit.timestamp).getTime();
      const intervalStart = visitTime - (visitTime % intervalDuration);

      const interval = intervals.find(i => i.start === intervalStart);
      if (interval) {
        interval.count += 1;
      } else {
        intervals.push({ start: intervalStart, count: 1 });
      }
    });

    return intervals;
  };

  const getChartData = () => {
    if (!dashboardData) return {};

    const aggregatedData = aggregateVisits(dashboardData.visits);
    const labels = aggregatedData.map(interval => new Date(interval.start).toLocaleTimeString());
    const data = aggregatedData.map(interval => interval.count);

    return {
      labels,
      datasets: [
        {
          label: 'Visits',
          data,
          backgroundColor: 'rgba(255, 132, 0, 0.6)', // lightBrandOrange with opacity
          borderColor: 'rgba(255, 132, 0, 1)', // brandOrange
          borderWidth: 1,
          fill: false,
        },
      ],
    };
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="flex justify-center items-center mb-4 w-full">
        <h1 className="text-2xl font-bold" style={{ color: '#333333' }}>Dashboard</h1>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        dashboardData ? (
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-md shadow-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
                <h2 className="text-lg font-bold" style={{ color: '#333333' }}>Today's Visitors</h2>
                <p style={{ color: '#333333' }}>{dashboardData.todayVisitors}</p>
              </div>
              <div className="p-4 rounded-md shadow-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
                <h2 className="text-lg font-bold" style={{ color: '#333333' }}>Yesterday's Visitors</h2>
                <p style={{ color: '#333333' }}>{dashboardData.yesterdayVisitors}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-md shadow-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
                <h2 className="text-lg font-bold" style={{ color: '#333333' }}>Total Products</h2>
                <p style={{ color: '#333333' }}>{dashboardData.totalProducts}</p>
              </div>
              <div className="p-4 rounded-md shadow-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
                <h2 className="text-lg font-bold" style={{ color: '#333333' }}>Total Menus</h2>
                <p style={{ color: '#333333' }}>{dashboardData.totalMenus}</p>
              </div>
              <div className="p-4 rounded-md shadow-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
                <h2 className="text-lg font-bold" style={{ color: '#333333' }}>Total Discounts</h2>
                <p style={{ color: '#333333' }}>{dashboardData.totalDiscounts}</p>
              </div>
              <div className="p-4 rounded-md shadow-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
                <h2 className="text-lg font-bold" style={{ color: '#333333' }}>Total Inactive Products</h2>
                <p style={{ color: '#333333' }}>{dashboardData.totalInactive}</p>
              </div>
            </div>
            <div className="p-4 rounded-md shadow-lg flex flex-col h-full" style={{ backgroundColor: '#F5F5F5' }}>
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => handleTimeFrameChange('daily')}
                  className={`mr-2 ${timeFrame === 'daily' ? 'bg-[#FF8400] text-[#FFFFFF]' : 'bg-[#FFB84D] text-[#333333]'}`}>
                  Daily
                </Button>
                <Button
                  onClick={() => handleTimeFrameChange('weekly')}
                  className={`mr-2 ${timeFrame === 'weekly' ? 'bg-[#FF8400] text-[#FFFFFF]' : 'bg-[#FFB84D] text-[#333333]'}`}>
                  Weekly
                </Button>
                <Button
                  onClick={() => handleTimeFrameChange('monthly')}
                  className={`${timeFrame === 'monthly' ? 'bg-[#FF8400] text-[#FFFFFF]' : 'bg-[#FFB84D] text-[#333333]'}`}>
                  Monthly
                </Button>
              </div>
              <div className="flex-grow">
                <Line data={getChartData()} options={chartOptions} />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#333333' }}>Loading...</div>
        )
      )}
    </div>
  );
};

export default DashboardPage;
