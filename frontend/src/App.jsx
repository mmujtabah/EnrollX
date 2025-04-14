import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import StudentHome from "./pages/student/StudentHome";
import StudentLogin from "./pages/student/Login";
import StudentRegister from "./pages/student/Register";
import StudentForgotPassword from "./pages/student/ForgotPassword";
import About from "./pages/About";
import AdminLogin from "./pages/admin/Login"
import AdminDashboard from "./pages/admin/AdminDashboard";
import UpdateStudent from "./pages/admin/UpdateStudent";
import UpdateInstructors from "./pages/admin/UpdateInstructors";


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
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-update-student" element={<UpdateStudent />} />
        <Route path="/admin-update-instructors" element={<UpdateInstructors />} />
      </Routes>
    </div>
  );
};

export default App;
