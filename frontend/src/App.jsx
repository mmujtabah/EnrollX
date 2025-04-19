import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";

import Home from "./pages/Home";
import About from "./pages/About";

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="/student-portal" element={<StudentPortal />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/student-forgot-password" element={<StudentForgotPassword />} />
      </Routes>
    </div>
  );
};

export default App;
