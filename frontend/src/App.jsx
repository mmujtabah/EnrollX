import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import StudentHome from "./pages/student/StudentHome";
import StudentLogin from "./pages/student/Login";
import StudentRegister from "./pages/student/Register";
import StudentForgotPassword from "./pages/student/ForgotPassword";
import About from "./pages/About";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/student-home" element={<StudentHome />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/student-forgot-password" element={<StudentForgotPassword />} />
      </Routes>
    </div>
  );
};

export default App;
