"use client"
import { useState, useEffect, useRef } from 'react';
import { FaBars, FaHome, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useClerk, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const sidebarRef = useRef(null);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me'); // Adjust the endpoint as needed
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      {/* Toggle button for sidebar */}
      <button
        aria-controls="default-sidebar"
        type="button"
        className={`fixed top-2 left-2 z-50 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 ${isOpen ? 'hidden' : 'sm:hidden'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Open sidebar</span>
        <FaBars className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 h-screen transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:w-64 bg-brandWhite`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 flex flex-col justify-between">
          <div className="flex items-center justify-center mb-2 mt-2">
            <img src="/logo.svg" alt="Logo" className="w-40" />
          </div>
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="/dashboard" className="flex items-center p-2 text-brandBlack rounded-lg">
                <FaHome className="w-5 h-5 text-brandOrange transition duration-75" />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/profile" className="flex items-center p-2 text-brandBlack rounded-lg">
                <FaUser className="w-5 h-5 text-brandOrange transition duration-75" />
                <span className="ml-3">Store Profile</span>
              </Link>
            </li>
            <li>
              <Link href="/my-qr" className="flex items-center p-2 text-brandBlack rounded-lg">
                <FaCog className="w-5 h-5 text-brandOrange transition duration-75" />
                <span className="ml-3">Menu Settings</span>
              </Link>
            </li>
            <li>
              <Link href="/my-products" className="flex items-center p-2 text-brandBlack rounded-lg">
                <FaCog className="w-5 h-5 text-brandOrange transition duration-75" />
                <span className="ml-3">Products Settings</span>
              </Link>
            </li>
          </ul>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center space-x-4">
              <UserButton />
              {userData && (
                <div className="text-left">
                  <p className="text-sm text-brandBlack">{userData.name}</p>
                  <p className="text-xs text-brandBlack">{userData.businessName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
