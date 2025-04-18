import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";

import Home from "./pages/Home";
import About from "./pages/About";

import StudentPortal from "./pages/student/StudentPortal";
import StudentLogin from "./pages/student/StudentLogin";
import StudentRegister from "./pages/student/StudentRegister";
import StudentForgotPassword from "./pages/student/StudentForgotPassword";
import StudentDashboard from "./pages/student/StudentDashboard";

import InstructorPortal from "./pages/instructor/InstructorPortal";
import InstructorLogin from "./pages/instructor/InstructorLogin";
import InstructorForgotPassword from "./pages/instructor/InstructorForgotPassword";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import ViewRegisteredStudents from "./pages/instructor/ViewRegisteredStudents"
import ViewAssignedTAs from "./pages/instructor/ViewAssignedTAs"
import ViewCoursesTaught from "./pages/instructor/ViewCoursesTaught";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UpdateStudent from "./pages/admin/UpdateStudent";
import UpdateInstructors from "./pages/admin/UpdateInstructors";
import CourseRegistration from "./pages/admin/CourseRegistration";

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

        <Route path="/instructor-portal" element={<InstructorPortal />} />
        <Route path="/instructor-login" element={<InstructorLogin />} />
        <Route path="/instructor-forgot-password" element={<InstructorForgotPassword />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor-dashboard"
          element={
            <PrivateRoute>
              <InstructorDashboard />
            </PrivateRoute>
          }
        />
         <Route
          path="/instructor-registered-students"
          element={
            <PrivateRoute>
              <ViewRegisteredStudents />
            </PrivateRoute>
          }
        />
         <Route
          path="/instructor-assigned-TAs"
          element={
            <PrivateRoute>
              <ViewAssignedTAs />
            </PrivateRoute>
          }
        />
         <Route
          path="/instructor-courses"
          element={
            <PrivateRoute>
              <ViewCoursesTaught />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-update-student"
          element={
            <PrivateRoute>
              <UpdateStudent />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-update-instructors"
          element={
            <PrivateRoute>
              <UpdateInstructors />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-course-registration"
          element={
            <PrivateRoute>
              <CourseRegistration />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
