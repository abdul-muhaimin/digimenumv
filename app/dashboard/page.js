"use client"
import { useUser } from '@clerk/nextjs';
import { useUpsertUser } from '@/hooks/useUpsertUser';

const DashboardPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();


  useUpsertUser(isLoaded, isSignedIn, user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1>Welcome to the Dashboard</h1>
        {/* Your dashboard content goes here */}
      </div>
    </div>
  );
};

export default DashboardPage;