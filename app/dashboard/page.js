"use client"
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import Spinner from '@/components/ui/Spinner';
import { useUser } from '@clerk/nextjs';
import OnboardingModal from '@/components/OnboardingModal';
import QrCodeModal from '@/components/QrCodeModal';
import { fetcher } from '@/utils/fetcher';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [timeFrame, setTimeFrame] = useState('daily');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);

  const { data: dashboardData, error, isValidating } = useSWR(
    isSignedIn ? `/api/dashboard?timeFrame=${timeFrame}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute deduplication
    }
  );

  const { data: onboardingData } = useSWR(
    isSignedIn ? `/api/users/${user?.id}/check-onboarding` : null,
    fetcher
  );

  useEffect(() => {
    if (onboardingData?.onboardingIncomplete) {
      setShowOnboarding(true);
    }
  }, [onboardingData]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const aggregateVisits = (visits) => {
    if (!visits) return [];

    const intervals = [];
    const intervalDuration = 30 * 60 * 1000;

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
          callback: (value) => (Number.isInteger(value) ? value : null),
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  if (!isLoaded || !isSignedIn) return <Spinner />;
  if (error) {
    toast.error('Failed to fetch dashboard data');
    return <div>Error loading data</div>;
  }

  const todayVisitors = dashboardData?.todayVisitors || 0;
  const yesterdayVisitors = dashboardData?.yesterdayVisitors || 0;
  const totalProducts = dashboardData?.totalProducts || 0;
  const totalMenus = dashboardData?.totalMenus || 0;
  const totalDiscounts = dashboardData?.totalDiscounts || 0;
  const totalInactive = dashboardData?.totalInactive || 0;

  return (
    <div className="container mx-auto p-4 min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="flex justify-center items-center mb-4 w-full">
        <h1 className="text-2xl font-bold" style={{ color: '#333333' }}>Dashboard</h1>
      </div>
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        user={user}
        onComplete={handleOnboardingComplete}
      />
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-md shadow-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
            <h2 className="text-lg font-bold" style={{ color: '#333333' }}>Today's Visitors</h2>
            <p style={{ color: '#333333' }}>{todayVisitors}</p>
          </div>
          <div className="p-4 rounded-md shadow-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
            <h2 className="text-lg font-bold" style={{ color: '#333333' }}>Yesterday's Visitors</h2>
            <p style={{ color: '#333333' }}>{yesterdayVisitors}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-md shadow-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
            <h2 className="text-lg font-bold" style={{ color: '#333333' }}>Total Products</h2>
            <p style={{ color: '#333333' }}>{totalProducts}</p>
          </div>
          <div className="p-4 rounded-md shadow-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
            <h2 className="text-lg font-bold" style={{ color: '#333333' }}>Total Menus</h2>
            <p style={{ color: '#333333' }}>{totalMenus}</p>
          </div>
          <div className="p-4 rounded-md shadow-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
            <h2 className="text-lg font-bold" style={{ color: '#333333' }}>Total Discounts</h2>
            <p style={{ color: '#333333' }}>{totalDiscounts}</p>
          </div>
          <div className="p-4 rounded-md shadow-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
            <h2 className="text-lg font-bold" style={{ color: '#333333' }}>Total Inactive Products</h2>
            <p style={{ color: '#333333' }}>{totalInactive}</p>
          </div>
        </div>
        <div className="p-4 rounded-md shadow-lg flex flex-col h-full" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setTimeFrame('daily')}
              className={`mr-2 ${timeFrame === 'daily' ? 'bg-[#FF8400] text-[#FFFFFF]' : 'bg-[#FFB84D] text-[#333333]'}`}>
              Daily
            </Button>
            <Button
              onClick={() => setTimeFrame('weekly')}
              className={`mr-2 ${timeFrame === 'weekly' ? 'bg-[#FF8400] text-[#FFFFFF]' : 'bg-[#FFB84D] text-[#333333]'}`}>
              Weekly
            </Button>
            <Button
              onClick={() => setTimeFrame('monthly')}
              className={`${timeFrame === 'monthly' ? 'bg-[#FF8400] text-[#FFFFFF]' : 'bg-[#FFB84D] text-[#333333]'}`}>
              Monthly
            </Button>
          </div>
          <div className="flex-grow">
            {dashboardData ? (
              <Line data={getChartData()} options={chartOptions} />
            ) : (
              <Spinner />
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => setShowQrCodeModal(true)} className="bg-[#FF8400] text-[#FFFFFF]">
              Show QR Code
            </Button>
          </div>
        </div>
      </div>
      <QrCodeModal
        isOpen={showQrCodeModal}
        onClose={() => setShowQrCodeModal(false)}
        qrCodeUrl={dashboardData?.qrCodeUrl}
      />
    </div>
  );
};

export default DashboardPage;
