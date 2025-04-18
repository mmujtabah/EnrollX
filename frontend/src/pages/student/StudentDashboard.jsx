import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";
import Layout from "../components/Layout.jsx";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

const getCookie = (name) => {
  const cookieArray = document.cookie.split("; ");
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].split("=");
    if (cookie[0] === name) {
      return cookie[1];
    }
  }
  return null;
};

const StudentDashboard = () => {
  const [animate, setAnimate] = useState(false);
  const [studentName, setStudentName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("token"); // 🍪 use your getCookie function
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // ✅ decode token correctly
        setStudentName(decodedToken.name || "Student");
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    }

    const timeout = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      navigate("/student-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Layout>
      <div className="student-dashboard">
        <h1>Student Dashboard</h1>
        <p>Welcome, {studentName || "Student"}! Access and manage your academic activities efficiently.</p>
        <div className="dashboard-cards">
          <div className={`dashboard-card ${animate ? "dashboard-card-animated" : ""}`}>
            <h2>📘 My Courses</h2>
            <p>View all your enrolled courses in detail.</p>
          </div>
          <div className={`dashboard-card ${animate ? "dashboard-card-animated" : ""}`}>
            <h2>🧾 Courses Offered</h2>
            <p>Browse and enroll in available courses this semester.</p>
          </div>
          <div className={`dashboard-card ${animate ? "dashboard-card-animated" : ""}`}>
            <h2>❌ Drop Course</h2>
            <p>Manage and drop your enrolled courses with ease.</p>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
