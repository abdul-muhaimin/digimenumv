"use client";

import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import SideBar from "@/components/layout/SideBar";
import Footer from "@/components/layout/Footer";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Define pages where the sidebar should be shown
  const showSidebarPages = ['/dashboard', '/my-qr', '/profile', 'my-qr/menus/2'];
  const isSidebarVisible = showSidebarPages.includes(pathname);

  return (
    <ClerkProvider>
      <html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </Head>
        <body className={`${inter.className} full-vh`}>
          <div className="flex min-h-screen">
            {isSidebarVisible && <SideBar />}
            <div className={`flex-grow flex flex-col transition-all duration-300 ${isSidebarVisible ? 'sm:ml-64' : ''}`}>
              <ToastContainer />
              <main className="">
                {children}
              </main>
              {/* <Footer /> */}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
