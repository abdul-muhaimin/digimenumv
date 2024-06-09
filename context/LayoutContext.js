"use client"
// context/LayoutContext.js
import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [showNavbar, setShowNavbar] = useState(true);

  return (
    <LayoutContext.Provider value={{ showNavbar, setShowNavbar }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
