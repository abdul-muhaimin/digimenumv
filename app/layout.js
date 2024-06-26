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
import { CartProvider } from '@/context/cartContext';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Define a function to check if the sidebar should be visible
  const shouldShowSidebar = (path) => {
    const staticPaths = ['/dashboard', '/profile', '/my-products', '/my-qr'];
    const dynamicPattern = /^\/my-qr\/.*/;

    // Check if the path matches any of the static paths or the dynamic pattern
    return staticPaths.includes(path) || dynamicPattern.test(path);
  };

  const isSidebarVisible = shouldShowSidebar(pathname);

  return (
    <ClerkProvider>
      <CartProvider>
        <html lang="en">
          <Head>
            <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Bellota:wght@400;700&display=swap" rel="stylesheet" />
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
      </CartProvider>
    </ClerkProvider>
  );
}
