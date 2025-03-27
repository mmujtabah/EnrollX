// src/pages/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';  // Import Navbar component

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar /> {/* Add the Navbar here */}
      <main>
        {children} {/* This is where the Home content will appear */}
      </main>
    </div>
  );
};

export default Layout;
